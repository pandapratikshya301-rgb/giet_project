import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart({ cart, updateQuantity, removeFromCart, appliedCoupon, applyCouponCode }) {
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = (subtotal * appliedCoupon.value) / 100;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const gst = discountedSubtotal * 0.18; // 18% GST

  let deliveryCharges = 15.0;
  if (cart.length === 0) {
    deliveryCharges = 0;
  } else if (discountedSubtotal >= 150.0 || (appliedCoupon && appliedCoupon.code === 'FREESHIP')) {
    deliveryCharges = 0.0;
  }

  const grandTotal = discountedSubtotal + gst + deliveryCharges;

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCouponCode(couponInput);
    if (success) {
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = () => {
    applyCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850/80 rounded-3xl p-8 shadow-sm animate-fade-in">
        <span className="text-5xl">🛒</span>
        <h3 className="text-xl font-extrabold text-zinc-800 dark:text-zinc-200">Your Shopping Cart is Empty</h3>
        <p className="text-sm text-zinc-500 max-w-sm text-center">Looks like you haven't added anything to your cart yet. Explore our latest items!</p>
        <Link
          to="/shop"
          className="mt-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 animate-fade-in">
      <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white mb-6">Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items list - spans 2 columns on desktop */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Product Thumbnail */}
              <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-950 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-zinc-100 dark:border-zinc-850">
                <img src={item.thumbnail} alt={item.title} className="object-contain h-full w-full p-1" />
              </div>

              {/* Product details and adjustments */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-extrabold uppercase text-violet-500 tracking-wider">
                    {item.category}
                  </span>
                  <Link to={`/shop/product/${item.id}`} className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-violet-500 transition-colors truncate">
                    {item.title}
                  </Link>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Price: ${item.price.toFixed(2)} each
                  </span>
                </div>

                {/* Qty controls & delete */}
                <div className="flex items-center justify-between sm:justify-start gap-4">
                  {/* Qty buttons */}
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg overflow-hidden h-9">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-850 font-extrabold text-sm cursor-pointer select-none"
                    >
                      －
                    </button>
                    <span className="px-2.5 font-bold text-xs text-zinc-800 dark:text-zinc-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-850 font-extrabold text-sm cursor-pointer select-none"
                    >
                      ＋
                    </button>
                  </div>

                  {/* Total price for this item */}
                  <span className="text-sm font-black text-zinc-950 dark:text-white min-w-[70px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove CTA */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-zinc-400 hover:text-rose-500 transition-colors text-sm cursor-pointer"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Continue shopping link */}
          <Link
            to="/shop"
            className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline self-start mt-2"
          >
            ← Add more items to your order
          </Link>
        </div>

        {/* Order Summary box - Spans 1 column */}
        <div className="flex flex-col gap-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-3xl p-6 shadow-sm">
          <h3 className="font-extrabold text-lg text-zinc-950 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
            Order Summary
          </h3>

          {/* Calculations invoice */}
          <div className="flex flex-col gap-3.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-zinc-900 dark:text-zinc-100">${subtotal.toFixed(2)}</span>
            </div>

            {/* Coupon row */}
            {appliedCoupon ? (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <div className="flex flex-col">
                  <span>Coupon Applied:</span>
                  <span className="font-black text-[10px] tracking-wider uppercase text-emerald-700 dark:text-emerald-300">
                    {appliedCoupon.code}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>
                    {appliedCoupon.type === 'percent'
                      ? `-$${discount.toFixed(2)} (-${appliedCoupon.value}%)`
                      : 'Waived delivery charge'}
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-emerald-700 dark:text-emerald-300 hover:text-red-500 p-0.5 rounded-md hover:bg-emerald-500/20 transition-all font-black"
                    title="Remove coupon"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="text-zinc-900 dark:text-zinc-100">${gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span>Delivery Charges</span>
                {deliveryCharges === 0 && (
                  <span className="text-[9px] font-black uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                    Free
                  </span>
                )}
              </div>
              <span className="text-zinc-900 dark:text-zinc-100">
                {deliveryCharges === 0 ? '$0.00' : `$${deliveryCharges.toFixed(2)}`}
              </span>
            </div>

            {deliveryCharges > 0 && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 italic font-medium -mt-2">
                Add ${(150 - discountedSubtotal).toFixed(2)} more to unlock free delivery!
              </span>
            )}

            <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 my-2" />

            <div className="flex justify-between items-baseline text-sm font-black text-zinc-950 dark:text-white">
              <span className="text-zinc-800 dark:text-zinc-200 text-xs font-bold">Grand Total</span>
              <span className="text-xl">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon application form */}
          {!appliedCoupon && (
            <form onSubmit={handleCouponSubmit} className="mt-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">Apply Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SAVE10, GIET20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-xs focus:outline-none focus:border-violet-500 uppercase tracking-wider font-semibold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </div>
              <div className="mt-2 flex flex-col gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                <span>Available Codes:</span>
                <span>• <strong>SAVE10</strong>: 10% off items</span>
                <span>• <strong>GIET20</strong>: 20% off items</span>
                <span>• <strong>FREESHIP</strong>: Free shipping delivery charge</span>
              </div>
            </form>
          )}

          {/* Proceed to checkout CTA */}
          <button
            onClick={() => navigate('/shop/checkout')}
            className="w-full mt-4 h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-500/10 hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
