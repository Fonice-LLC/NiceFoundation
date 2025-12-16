import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import { getCurrentUser } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// GET /api/checkout/verify - Verify Stripe checkout session and create order
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get authenticated user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session ID is required',
        },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment not completed',
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
        message: 'Order already created',
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: currentUser.userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart is empty',
        },
        { status: 400 }
      );
    }

    // Create order items
    const orderItems = cart.items.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.salePrice || item.product.price,
    }));

    // Calculate total
    const total = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = await Order.create({
      user: currentUser.userId,
      items: orderItems,
      total,
      status: 'processing',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      stripeSessionId: sessionId,
    });

    // Clear the cart
    await Cart.findOneAndUpdate({ user: currentUser.userId }, { items: [] });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Verify checkout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to verify checkout',
      },
      { status: 500 }
    );
  }
}

