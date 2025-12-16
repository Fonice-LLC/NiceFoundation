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

  // Fetch cart from API when user is authenticated
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
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

  // Load cart when user authentication changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      console.error("User must be logged in to add items to cart");
      return;
    }

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
      return;
    }

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
      return;
    }

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
      return;
    }

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
