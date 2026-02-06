import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";

// Lazy initialization to avoid build-time errors
let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
    });
  }
  return stripe;
}

// POST /api/checkout - Create Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get request body
    const body = await request.json();
    const { items, email, name, shippingAddress } = body;

    // Validate cart items
    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart is empty",
        },
        { status: 400 },
      );
    }

    // Validate email for guest checkout
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 },
      );
    }

    // Get authenticated user (optional)
    const currentUser = await getCurrentUser();

    // Fetch product details for all items
    const productIds = items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const price = product.salePrice || product.price;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.brand,
            images: product.images.length > 0 ? [product.images[0]] : [],
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Prepare metadata with cart items
    const metadata: any = {
      cartItems: JSON.stringify(
        items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      ),
      guestEmail: email,
    };

    if (name) {
      metadata.guestName = name;
    }

    if (shippingAddress) {
      metadata.shippingAddress = JSON.stringify(shippingAddress);
    }

    if (currentUser) {
      metadata.userId = currentUser.userId;
    }

    // Create Stripe checkout session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: email,
      metadata,
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create checkout session",
      },
      { status: 500 },
    );
  }
}
