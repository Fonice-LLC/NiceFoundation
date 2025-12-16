import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getCurrentUser } from '@/lib/auth';

// DELETE /api/cart/[productId] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
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

    const { productId } = await context.params;

    // Find cart and remove item
    const cart = await Cart.findOne({ user: currentUser.userId });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart not found',
        },
        { status: 404 }
      );
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Item removed from cart',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove item from cart',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/cart/[productId] - Update item quantity
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
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

    const { productId } = await context.params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid quantity',
        },
        { status: 400 }
      );
    }

    // Find cart and update item quantity
    const cart = await Cart.findOne({ user: currentUser.userId });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart not found',
        },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found in cart',
        },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Cart updated',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update cart',
      },
      { status: 500 }
    );
  }
}

