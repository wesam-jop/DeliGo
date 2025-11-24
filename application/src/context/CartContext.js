import React, { createContext, useState, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from storage
  React.useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart_items');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Create new objects to avoid frozen object issues
        const freshCart = parsedCart.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));
        setCartItems(freshCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }
  };

  // Save cart to storage
  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem('cart_items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Create fresh copy of items to avoid frozen object issues
      const freshItems = prevItems.map((item) => ({ ...item }));
      const existingItem = freshItems.find((item) => item.id === product.id);
      let newItems;
      
      if (existingItem) {
        newItems = freshItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : { ...item }
        );
      } else {
        // Create a fresh copy of the product
        const newProduct = { ...product, quantity: 1 };
        newItems = [...freshItems, newProduct];
      }
      
      saveCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems
        .filter((item) => item.id !== productId)
        .map((item) => ({ ...item })); // Create fresh copies
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      // Create fresh copies of all items
      const newItems = prevItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: Math.max(1, quantity) };
        }
        return { ...item }; // Create fresh copy even if not modified
      });
      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => {
      // Create a safe copy to avoid frozen object issues
      const safeItem = { ...item };
      return total + (safeItem.quantity || 1);
    }, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Create a safe copy to avoid frozen object issues
      const safeItem = { ...item };
      const price = parseFloat(safeItem.price?.replace(/[^0-9.]/g, '') || 0);
      const quantity = safeItem.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    cartItems: cartItems.map((item) => ({ ...item })), // Always return fresh copies
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    isCartOpen,
    setIsCartOpen,
  }), [cartItems, isCartOpen]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

