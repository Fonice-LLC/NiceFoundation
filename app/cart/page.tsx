"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  brand: string;
}

interface CartDisplayItem {
  productId: string;
  quantity: number;
  product?: Product;
  loading: boolean;
}

export default function CartPage() {
  const { user } = useAuth();
  const { cart, removeFromCart } = useCart();
  const [cartItems, setCartItems] = useState<CartDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Shipping address fields
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (cart.length === 0) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      const items: CartDisplayItem[] = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        loading: true,
      }));

      try {
        await Promise.all(
          items.map(async (item) => {
            try {
              const response = await fetch(`/api/products/${item.productId}`);
              if (response.ok) {
                const data = await response.json();
                if (data.success) {
                  item.product = data.data;
                }
              }
            } catch (error) {
              console.error(`Error fetching product ${item.productId}:`, error);
            }
            item.loading = false;
          })
        );
      } catch (error) {
        console.error("Error fetching product details:", error);
      }

      setCartItems(items);
      setLoading(false);
    };

    fetchProducts();
  }, [isClient, cart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getItemTotal = (product: Product, quantity: number) => {
    const price = product.salePrice || product.price;
    return price * quantity;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.product) {
        return total + getItemTotal(item.product, item.quantity);
      }
      return total;
    }, 0);
  };

  const handleCheckout = async () => {
    // Validate guest checkout fields
    if (!user) {
      if (!guestEmail) {
        alert("Please enter your email address");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
        alert("Please enter a valid email address");
        return;
      }
      if (!guestName) {
        alert("Please enter your name");
        return;
      }
      if (!shippingAddress.fullName) {
        alert("Please enter the recipient's full name");
        return;
      }
      if (!shippingAddress.addressLine1) {
        alert("Please enter your street address");
        return;
      }
      if (!shippingAddress.city) {
        alert("Please enter your city");
        return;
      }
      if (!shippingAddress.state) {
        alert("Please enter your state");
        return;
      }
      if (!shippingAddress.zipCode) {
        alert("Please enter your ZIP code");
        return;
      }
      if (!shippingAddress.phone) {
        alert("Please enter your phone number");
        return;
      }
    }

    setCheckoutLoading(true);
    try {
      // Prepare checkout data
      const checkoutData: any = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        email: user ? user.email : guestEmail,
        name: user ? user.name : guestName || undefined,
      };

      // Add shipping address for guest users
      if (!user) {
        checkoutData.shippingAddress = shippingAddress;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url;
      } else {
        alert(data.error || "Failed to create checkout session");
        setCheckoutLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to proceed to checkout");
      setCheckoutLoading(false);
    }
  };

  if (loading && cart.length > 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <p className="text-gray-500 mb-8">
            Start shopping to add items to your cart
          </p>
          <Link
            href="/products"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-6 border-b last:border-b-0"
              >
                {item.product ? (
                  <>
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            {item.product.brand}
                          </p>
                          <h3 className="font-semibold text-lg line-clamp-2">
                            {item.product.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            Qty: {item.quantity}
                          </span>
                          {item.product.salePrice ? (
                            <div className="flex gap-2">
                              <span className="font-bold text-pink-600">
                                {formatPrice(item.product.salePrice)}
                              </span>
                              <span className="text-gray-500 line-through text-sm">
                                {formatPrice(item.product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold">
                              {formatPrice(item.product.price)}
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-lg">
                          {formatPrice(
                            getItemTotal(item.product, item.quantity)
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 text-center py-4">
                    <p className="text-gray-500">Product not found</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Guest Checkout Form */}
            {!user && (
              <div className="mb-6 space-y-4 border-b pb-6">
                <h3 className="font-semibold text-gray-900">
                  Contact Information
                </h3>
                <div>
                  <label
                    htmlFor="guestEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="guestEmail"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="guestName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                <h3 className="font-semibold text-gray-900 pt-4">
                  Shipping Address
                </h3>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="addressLine1"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        addressLine1: e.target.value,
                      })
                    }
                    placeholder="123 Main St"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="addressLine2"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apartment, suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        addressLine2: e.target.value,
                      })
                    }
                    placeholder="Apt 4B"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      placeholder="New York"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state: e.target.value,
                        })
                      }
                      placeholder="NY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        zipCode: e.target.value,
                      })
                    }
                    placeholder="10001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-pink-600">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || cartItems.length === 0}
              className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {checkoutLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </button>

            <Link
              href="/products"
              className="block text-center text-pink-600 hover:text-pink-700 font-medium py-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
