'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

/**
 * Shopping Cart Context
 */
const CartContext = createContext({});

/**
 * Custom hook to use cart context
 * @returns {Object} Cart context value
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Cart Provider Component
 * Manages shopping cart state and operations
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  /**
   * Load cart from localStorage
   */
  const loadCart = () => {
    if (typeof window !== 'undefined' && user) {
      const savedCart = localStorage.getItem(`cart_${user.uid}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  };

  /**
   * Save cart to localStorage
   * @param {Array} items - Cart items to save
   */
  const saveCart = (items) => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(items));
    }
  };

  /**
   * Add item to cart
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   * @param {string} size - Selected size
   * @param {string} color - Selected color
   */
  const addToCart = (product, quantity = 1, size = '', color = '') => {
    setIsLoading(true);
    
    const cartItem = {
      id: `${product.id}_${size}_${color}`,
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      originalPrice: product.price,
      image: product.images[0],
      quantity,
      size,
      color,
      addedAt: new Date().toISOString()
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItem.id);
      
      let newItems;
      if (existingItem) {
        // Update quantity if item already exists
        newItems = prevItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...prevItems, cartItem];
      }
      
      saveCart(newItems);
      setIsLoading(false);
      return newItems;
    });
  };

  /**
   * Remove item from cart
   * @param {string} itemId - Item ID to remove
   */
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      saveCart(newItems);
      return newItems;
    });
  };

  /**
   * Update item quantity
   * @param {string} itemId - Item ID to update
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      saveCart(newItems);
      return newItems;
    });
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined' && user) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
  };

  /**
   * Get cart total
   * @returns {number} Total cart amount
   */
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  /**
   * Get cart item count
   * @returns {number} Total number of items in cart
   */
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  /**
   * Check if product is in cart
   * @param {string} productId - Product ID to check
   * @returns {boolean} Is product in cart
   */
  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const value = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};