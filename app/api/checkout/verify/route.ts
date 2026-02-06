import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Order, { IOrder } from "@/models/Order";
import Product from "@/models/Product";
import Cart from "@/models/Cart";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

// GET /api/checkout/verify - Verify Stripe checkout session and create order
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Session ID is required",
        },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          success: false,
          error: "Payment not completed",
        },
        { status: 400 }
      );
    }

    // Check if order already exists for this session
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      return NextResponse.json({
        success: true,
        data: existingOrder,
        message: "Order already created",
      });
    }

    // Get cart items from session metadata
    const metadata = session.metadata;
    if (!metadata || !metadata.cartItems) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart data not found in session",
        },
        { status: 400 }
      );
    }

    const cartItems = JSON.parse(metadata.cartItems);
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart is empty",
        },
        { status: 400 }
      );
    }

    // Fetch product details
    const productIds = cartItems.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // Create order items
    const orderItems = cartItems.map((item: any) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      return {
        product: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        quantity: item.quantity,
        image: product.images.length > 0 ? product.images[0] : undefined,
      };
    });

    // Calculate total
    const total = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Get authenticated user (optional)
    const currentUser = await getCurrentUser();

    // Prepare order data
    const orderData: any = {
      items: orderItems,
      total,
      status: "processing",
      paymentMethod: "card",
      paymentStatus: "paid",
      stripeSessionId: sessionId,
    };

    // Add user or guest information
    if (currentUser) {
      orderData.user = currentUser.userId;
    } else {
      orderData.guestEmail = metadata.guestEmail;
      if (metadata.guestName) {
        orderData.guestName = metadata.guestName;
      }
    }

    // Add shipping address if provided
    if (metadata.shippingAddress) {
      try {
        orderData.shippingAddress = JSON.parse(metadata.shippingAddress);
      } catch (error) {
        console.error("Error parsing shipping address:", error);
      }
    }

    // Create order
    const createdOrder = await Order.create(orderData);
    const order = Array.isArray(createdOrder) ? createdOrder[0] : createdOrder;

    // Clear database cart for authenticated users
    if (currentUser) {
      await Cart.findOneAndUpdate(
        { user: currentUser.userId },
        { items: [] },
        { new: true }
      );
    }

    // Send order confirmation email
    try {
      // Get customer name and email
      let customerName = metadata.guestName || "Valued Customer";
      let customerEmail = metadata.guestEmail;

      if (currentUser) {
        const user = await User.findById(currentUser.userId);
        if (user) {
          customerName = user.name;
          customerEmail = user.email;
        }
      }

      // Prepare email data with full product details
      const emailData: any = {
        orderId: order._id.toString(),
        customerName,
        customerEmail,
        items: orderItems.map((item: any) => {
          // Get the full product object from productMap
          const fullProduct = productMap.get(item.product.toString());
          return {
            product: {
              name: fullProduct?.name || item.name || "Product",
              brand: fullProduct?.brand || "Unknown Brand",
              price: fullProduct?.price || item.price,
              salePrice: fullProduct?.salePrice,
              images: fullProduct?.images || (item.image ? [item.image] : []),
            },
            quantity: item.quantity,
            price: item.price * item.quantity,
          };
        }),
        total,
        orderDate: order.createdAt,
        paymentMethod: "card",
      };

      // Add shipping address if available
      if (metadata.shippingAddress) {
        try {
          emailData.shippingAddress = JSON.parse(metadata.shippingAddress);
        } catch (error) {
          console.error("Error parsing shipping address for email:", error);
        }
      }

      // Send email asynchronously (don't wait for it)
      sendOrderConfirmationEmail(emailData).catch((error) => {
        console.error("Failed to send order confirmation email:", error);
      });
    } catch (emailError) {
      // Log error but don't fail the order creation
      console.error("Error preparing confirmation email:", emailError);
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (error: any) {
    console.error("Verify checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to verify checkout",
      },
      { status: 500 }
    );
  }
}
