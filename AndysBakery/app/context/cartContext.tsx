"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
  maxQuantity?: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: string) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  increaseQuantity: (id: string, amount: number) => void;
  decreaseQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
  checkCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.id === item.id
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = prev.map((cartItem) => {
          if (cartItem.id !== item.id) {
            return cartItem;
          }

          const requestedQuantity =
            cartItem.quantity + Math.max(item.quantity, 1);

          const maxQuantity =
            item.maxQuantity ?? cartItem.maxQuantity;

          const quantity =
            maxQuantity !== undefined
              ? Math.min(requestedQuantity, maxQuantity)
              : requestedQuantity;

          return {
            ...cartItem,
            quantity,
            maxQuantity,
          };
        });
      } else {
        const quantity =
          item.maxQuantity !== undefined
            ? Math.min(item.quantity, item.maxQuantity)
            : item.quantity;

        updatedCart = [
          ...prev,
          {
            ...item,
            quantity,
          },
        ];
      }

      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updatedCart = prev.filter((item) => item.id !== id);

      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateQuantity = (item: CartItem, quantity: number) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.id === item.id
      );

      let updatedCart;

      if (quantity <= 0) {
        updatedCart = prev.filter(
          (cartItem) => cartItem.id !== item.id
        );
      } else if (existingItem) {
        updatedCart = prev.map((cartItem) => {
          if (cartItem.id !== item.id) {
            return cartItem;
          }

          const maxQuantity =
            item.maxQuantity ?? cartItem.maxQuantity;

          const safeQuantity =
            maxQuantity !== undefined
              ? Math.min(quantity, maxQuantity)
              : quantity;

          return {
            ...cartItem,
            quantity: safeQuantity,
            maxQuantity,
          };
        });
      } else {
        const safeQuantity =
          item.maxQuantity !== undefined
            ? Math.min(quantity, item.maxQuantity)
            : quantity;

        updatedCart = [
          ...prev,
          {
            ...item,
            quantity: safeQuantity,
          },
        ];
      }

      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const increaseQuantity = (id: string, amount: number) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const requestedQuantity =
          item.quantity + Math.max(amount, 0);

        const quantity =
          item.maxQuantity !== undefined
            ? Math.min(requestedQuantity, item.maxQuantity)
            : requestedQuantity;

        return {
          ...item,
          quantity,
        };
      });

      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const decreaseQuantity = (id: string, amount: number) => {
    setCart((prev) => {
      const updatedCart = prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - Math.max(amount, 0),
              }
            : item
        )
        .filter((item) => item.quantity > 0);

      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const checkCart = () => {
    console.log(cart);
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.setItem("cart", JSON.stringify([]));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        checkCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}