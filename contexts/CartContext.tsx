"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // LocalStorage key for guest cart
  const GUEST_CART_KEY = "guest_cart";

  // Load cart from localStorage (for guest users)
  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem(GUEST_CART_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setCart([]);
    }
  };

  // Save cart to localStorage (for guest users)
  const saveLocalCart = (items: CartItem[]) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  };

  // Clear localStorage cart
  const clearLocalCart = () => {
    try {
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error("Error clearing localStorage cart:", error);
    }
  };

  // Fetch cart from API when user is authenticated
  const fetchCart = async () => {
    if (!isAuthenticated) {
      loadLocalCart();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        credentials: "include", // Ensure cookies are sent
      });
      const data = await response.json();
      console.log("Fetch cart response:", data);

      if (response.ok && data.success && data.data) {
        // Convert API format to CartItem format
        const items: CartItem[] = data.data.items.map((item: any) => ({
          productId:
            typeof item.product === "object" ? item.product._id : item.product,
          quantity: item.quantity,
        }));
        setCart(items);
      } else {
        // Don't log error if just unauthorized (user not logged in)
        if (response.status !== 401) {
          console.error("Failed to fetch cart:", data.error || "Unknown error");
        }
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Merge localStorage cart into database cart when user logs in
  const mergeLocalCartToDatabase = async () => {
    try {
      const savedCart = localStorage.getItem(GUEST_CART_KEY);
      if (!savedCart) return;

      const localCart: CartItem[] = JSON.parse(savedCart);
      if (localCart.length === 0) return;

      // Add each item from local cart to database
      for (const item of localCart) {
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
          }),
        });
      }

      // Clear localStorage cart after merging
      clearLocalCart();

      // Refresh cart from database
      await fetchCart();
    } catch (error) {
      console.error("Error merging local cart to database:", error);
    }
  };

  // Load cart when user authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      // User just logged in - merge local cart to database
      mergeLocalCartToDatabase();
    } else {
      // Guest user - load from localStorage
      loadLocalCart();
    }
  }, [isAuthenticated, user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      // Guest user - use localStorage
      const existingItemIndex = cart.findIndex(
        (item) => item.productId === productId
      );

      let newCart: CartItem[];
      if (existingItemIndex > -1) {
        // Update quantity
        newCart = [...cart];
        newCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        newCart = [...cart, { productId, quantity }];
      }

      setCart(newCart);
      saveLocalCart(newCart);
      return;
    }

    // Authenticated user - use database
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      console.log("Add to cart response:", data);

      if (response.ok && data.success && data.data) {
        const items: CartItem[] = data.data.items.map((item: any) => ({
          productId:
            typeof item.product === "object" ? item.product._id : item.product,
          quantity: item.quantity,
        }));
        setCart(items);
      } else {
        console.error("Failed to add to cart:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) {
      // Guest user - use localStorage
      const newCart = cart.filter((item) => item.productId !== productId);
      setCart(newCart);
      saveLocalCart(newCart);
      return;
    }

    // Authenticated user - use database
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
        credentials: "include", // Ensure cookies are sent
      });

      const data = await response.json();
      console.log("Remove from cart response:", data);

      if (response.ok && data.success && data.data) {
        const items: CartItem[] = data.data.items.map((item: any) => ({
          productId:
            typeof item.product === "object" ? item.product._id : item.product,
          quantity: item.quantity,
        }));
        setCart(items);
      } else {
        console.error(
          "Failed to remove from cart:",
          data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      // Guest user - use localStorage
      const newCart = cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      setCart(newCart);
      saveLocalCart(newCart);
      return;
    }

    // Authenticated user - use database
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      console.log("Update quantity response:", data);

      if (response.ok && data.success && data.data) {
        const items: CartItem[] = data.data.items.map((item: any) => ({
          productId:
            typeof item.product === "object" ? item.product._id : item.product,
          quantity: item.quantity,
        }));
        setCart(items);
      } else {
        console.error(
          "Failed to update quantity:",
          data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      // Guest user - clear localStorage
      setCart([]);
      clearLocalCart();
      return;
    }

    // Authenticated user - clear database cart
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        credentials: "include", // Ensure cookies are sent
      });

      if (response.ok) {
        setCart([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return cart.some((item) => item.productId === productId);
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    isInCart,
    getCartItemQuantity,
    loading,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
