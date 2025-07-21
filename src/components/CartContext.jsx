import React, { createContext, useContext, useState } from "react";

// Create a context for the cart
export const CartContext = createContext();

// CartProvider will wrap your app and provide cart state to all components
export function CartProvider({ children }) {
  // The cart state will be an array of { ...product, quantity }
  const [cart, setCart] = useState([]);

  // Add a product to the cart (increment quantity if already present)
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove a product from the cart by id
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Decrement quantity (remove if quantity is 1)
  const decrementQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Increment quantity
  const incrementQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => setCart([]);

  // The value provided to context consumers
  const value = { cart, addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity };

  // Provide the cart state and actions to children
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook for easy access to cart context
export function useCart() {
  return useContext(CartContext);
}
