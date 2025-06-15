'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  addedAt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isInCart: (productId: number) => boolean;
}

/**
 * Shopping Cart Context
 */
const CartContext = createContext<CartContextType>({} as CartContextType);

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
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
  const saveCart = (items: CartItem[]) => {
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
  const addToCart = (product: Product, quantity: number = 1, size: string = '', color: string = '') => {
    setIsLoading(true);
    
    const cartItem: CartItem = {
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
      
      let newItems: CartItem[];
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
  const removeFromCart = (itemId: string) => {
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
  const updateQuantity = (itemId: string, quantity: number) => {
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
  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  /**
   * Get cart item count
   * @returns {number} Total number of items in cart
   */
  const getCartItemCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  /**
   * Check if product is in cart
   * @param {number} productId - Product ID to check
   * @returns {boolean} Is product in cart
   */
  const isInCart = (productId: number): boolean => {
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

  const value: CartContextType = {
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