import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProductList from './ProductList.jsx';
import ProductDetails from './ProductDetails.jsx';
import Cart from './Cart.jsx';
import Checkout from './Checkout.jsx';

export default function Shop() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('giet_shop_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('giet_shop_coupon');
    return saved ? JSON.parse(saved) : null;
  });
  const [toast, setToast] = useState(null);
  const location = useLocation();

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('giet_shop_cart', JSON.stringify(cart));
  }, [cart]);

  // Save coupon to local storage
  useEffect(() => {
    localStorage.setItem('giet_shop_coupon', JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Trigger toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Add item to cart
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        showToast(`Increased quantity of ${product.title} in cart!`, 'info');
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      showToast(`${product.title} added to cart!`, 'success');
      return [...prev, { ...product, quantity: qty }];
    });
  };

  // Update item quantity
  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
    showToast('Cart updated!', 'info');
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const item = cart.find((i) => i.id === productId);
    setCart((prev) => prev.filter((i) => i.id !== productId));
    if (item) {
      showToast(`${item.title} removed from cart.`, 'warning');
    }
  };

  // Apply Coupon code logic
  const applyCouponCode = (code) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setAppliedCoupon(null);
      showToast('Coupon removed.', 'info');
      return true;
    }

    if (normalized === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', type: 'percent', value: 10 });
      showToast('Coupon SAVE10 applied! 10% discount added.', 'success');
      return true;
    } else if (normalized === 'GIET20') {
      setAppliedCoupon({ code: 'GIET20', type: 'percent', value: 20 });
      showToast('Coupon GIET20 applied! 20% discount added.', 'success');
      return true;
    } else if (normalized === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', type: 'freeship', value: 0 });
      showToast('Coupon FREESHIP applied! Delivery charge waived.', 'success');
      return true;
    } else {
      showToast('Invalid Coupon Code!', 'error');
      return false;
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Calculate total items
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Generate breadcrumb links based on current path
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return (
      <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
        <Link to="/" className="hover:text-violet-500 transition-colors">Home</Link>
        <span>/</span>
        {paths.map((path, idx) => {
          const url = `/${paths.slice(0, idx + 1).join('/')}`;
          const label = path.charAt(0).toUpperCase() + path.slice(1);
          const isLast = idx === paths.length - 1;

          if (isLast) {
            return (
              <span key={url} className="text-zinc-700 dark:text-zinc-300 font-semibold truncate max-w-[120px]">
                {label}
              </span>
            );
          }

          return (
            <React.Fragment key={url}>
              <Link to={url} className="hover:text-violet-500 transition-colors capitalize">
                {label}
              </Link>
              <span>/</span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200">
      {/* Toast Alert popup */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-medium animate-slide-in backdrop-blur-md ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/5'
            : toast.type === 'warning'
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 shadow-amber-500/5'
            : toast.type === 'error'
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 shadow-rose-500/5'
            : 'bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400 shadow-violet-500/5'
        }`}>
          <span className="text-lg">
            {toast.type === 'success' && '✨'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <div>{toast.message}</div>
        </div>
      )}

      {/* Shop sub-navigation bar */}
      <div className="w-full border-b border-zinc-200/60 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 mb-6 rounded-3xl flex items-center justify-between shadow-sm">
        {getBreadcrumbs()}

        <div className="flex items-center gap-4">
          <Link
            to="/shop"
            className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-violet-500 transition-colors"
          >
            All Products
          </Link>
          <Link
            to="/shop/cart"
            className="relative p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center hover:border-violet-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:scale-105 transition-all duration-300 group"
          >
            <span className="text-lg group-hover:rotate-6 transition-transform">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-[10px] font-black text-white flex items-center justify-center border border-white dark:border-zinc-900 shadow-sm animate-pulse-slow">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Main E-commerce Views content */}
      <div className="flex-1 w-full max-w-full">
        <Routes>
          <Route
            index
            element={<ProductList cart={cart} addToCart={addToCart} />}
          />
          <Route
            path="product/:id"
            element={<ProductDetails cart={cart} addToCart={addToCart} />}
          />
          <Route
            path="cart"
            element={
              <Cart
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                appliedCoupon={appliedCoupon}
                applyCouponCode={applyCouponCode}
              />
            }
          />
          <Route
            path="checkout"
            element={
              <Checkout
                cart={cart}
                appliedCoupon={appliedCoupon}
                clearCart={clearCart}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}
