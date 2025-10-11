import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Generate unique cart item ID based on product + variants
  const generateCartItemId = (product) => {
    const variantKey = `${product.color || ''}-${product.size || ''}`;
    return `${product.id}-${variantKey}`;
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const cartItemId = generateCartItemId(product);
      const existing = prev.find(item => item.cartItemId === cartItemId);
      
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      
      return [...prev, { 
        ...product, 
        cartItemId,
        quantity: product.quantity || 1,
        addedAt: new Date().toISOString()
      }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Handle both string and number prices
      const price = typeof item.price === 'number' 
        ? item.price 
        : parseInt(String(item.price).replace(/[₹,]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' 
        ? item.price 
        : parseInt(String(item.price).replace(/[₹,]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        const savings = (item.originalPrice - item.price) * item.quantity;
        return total + savings;
      }
      return total;
    }, 0);
  };

  const getShippingCost = () => {
    const subtotal = getCartSubtotal();
    return subtotal >= 5000 ? 0 : 200; // Free shipping above ₹5000
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const isInCart = (productId, color = '', size = '') => {
    const cartItemId = generateCartItemId({ id: productId, color, size });
    return cartItems.some(item => item.cartItemId === cartItemId);
  };

  const getItemQuantity = (productId, color = '', size = '') => {
    const cartItemId = generateCartItemId({ id: productId, color, size });
    const item = cartItems.find(item => item.cartItemId === cartItemId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getCartSavings,
    getShippingCost,
    cartCount: getCartCount(),
    isInCart,
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};