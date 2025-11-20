'use client';

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
        <p className="text-gray-500 mb-8">Start shopping to add items to your cart</p>
        <a
          href="/products"
          className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    </div>
  );
}
