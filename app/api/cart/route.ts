import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

// GET /api/cart - Get user's cart
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

    // Find or create cart for user
    let cart = await Cart.findOne({ user: currentUser.userId }).populate('items.product').lean();

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ user: currentUser.userId, items: [] });
    }

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch cart',
      },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: currentUser.userId });

    if (!cart) {
      cart = await Cart.create({
        user: currentUser.userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Populate product details before returning
    await cart.populate('items.product');

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Item added to cart',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to add item to cart',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE(request: NextRequest) {
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

    await Cart.findOneAndUpdate(
      { user: currentUser.userId },
      { items: [] },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to clear cart',
      },
      { status: 500 }
    );
  }
}

