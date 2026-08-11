import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Checkout({ cart, appliedCoupon, clearCart }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculations (must match Cart calculations)
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

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid Email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Delivery Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zip.trim() || formData.zip.length < 5) newErrors.zip = 'Valid Pincode/Zip is required';
    
    // Simple dummy payment validation
    if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s+/g, '').length < 16) {
      newErrors.cardNumber = 'Valid 16-digit card number is required';
    }
    if (!formData.cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Expiry date must be in MM/YY format';
    }
    if (!formData.cardCvv.trim() || formData.cardCvv.length < 3) {
      newErrors.cardCvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = (matches && matches[0]) || '';
      const parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      if (parts.length > 0) {
        setFormData({ ...formData, [name]: parts.join(' ') });
      } else {
        setFormData({ ...formData, [name]: v });
      }
      return;
    }

    // Auto format expiry date MM/YY
    if (name === 'cardExpiry') {
      const v = value.replace(/[^0-9]/gi, '');
      if (v.length >= 2) {
        setFormData({ ...formData, [name]: `${v.slice(0, 2)}/${v.slice(2, 4)}` });
      } else {
        setFormData({ ...formData, [name]: v });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);
    if (!validateForm()) return;

    // Generate random order ID
    const randomId = `GIET-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
    setOrderId(randomId);
    setOrderPlaced(true);
    clearCart();
  };

  // Success view screen
  if (orderPlaced) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center animate-fade-in">
        <span className="text-6xl animate-bounce">🎉</span>
        <h2 className="mt-6 text-2xl font-black text-emerald-600 dark:text-emerald-400">Order Placed Successfully!</h2>
        <p className="mt-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500">Thank you for shopping with GIET Portal</p>
        
        {/* Invoice Summary Card */}
        <div className="mt-8 w-full p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 text-left flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-zinc-200/60 dark:border-zinc-800 pb-3 text-xs">
            <span className="font-semibold text-zinc-400">Order ID:</span>
            <span className="font-extrabold text-zinc-800 dark:text-zinc-200">{orderId}</span>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">Delivery Address:</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">{formData.name}</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">{formData.address}, {formData.city} - {formData.zip}</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Contact: {formData.phone}</span>
          </div>

          <div className="flex justify-between items-center border-t border-zinc-200/60 dark:border-zinc-800 pt-3 text-xs">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">Paid Amount:</span>
            <span className="font-black text-sm text-violet-600 dark:text-violet-400">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 bg-violet-500/10 text-violet-600 dark:text-violet-400 px-4 py-3 rounded-2xl border border-violet-500/20 text-xs font-semibold">
          <span>🚚</span>
          <span>Your items will ship within 24 hours. Expected delivery: 3-5 business days.</span>
        </div>

        <Link
          to="/shop"
          className="mt-10 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Fallback if user navigates to checkout directly with empty cart
  if (cart.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-3xl p-8 shadow-sm">
        <span className="text-5xl">🛒</span>
        <h3 className="text-xl font-bold text-zinc-800">Your Cart is Empty</h3>
        <p className="text-sm text-zinc-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 animate-fade-in">
      <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white mb-6">Secure Checkout</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form controls - spans 2 columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Shipping Address Container */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-3xl shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-black flex items-center justify-center">1</span>
              <span>Shipping Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                    validated && errors.name ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                  placeholder="John Doe"
                />
                {validated && errors.name && <span className="text-[10px] text-red-500 mt-1 block">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                    validated && errors.email ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                  placeholder="johndoe@example.com"
                />
                {validated && errors.email && <span className="text-[10px] text-red-500 mt-1 block">{errors.email}</span>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                    validated && errors.address ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                  placeholder="123 Street Name, Apartment, Suite"
                />
                {validated && errors.address && <span className="text-[10px] text-red-500 mt-1 block">{errors.address}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                    validated && errors.city ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                  placeholder="New Delhi"
                />
                {validated && errors.city && <span className="text-[10px] text-red-500 mt-1 block">{errors.city}</span>}
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1.5">Zip/Pincode</label>
                    <input
                      type="text"
                      name="zip"
                      maxLength="6"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                        validated && errors.zip ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                      placeholder="110001"
                    />
                    {validated && errors.zip && <span className="text-[10px] text-red-500 mt-1 block">{errors.zip}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength="12"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                        validated && errors.phone ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                      placeholder="9876543210"
                    />
                    {validated && errors.phone && <span className="text-[10px] text-red-500 mt-1 block">{errors.phone}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment details container */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-3xl shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-black flex items-center justify-center">2</span>
              <span>Payment Details (Dummy Gateway)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                    validated && errors.cardName ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                  placeholder="JOHN DOE"
                />
                {validated && errors.cardName && <span className="text-[10px] text-red-500 mt-1 block">{errors.cardName}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  maxLength="19"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                    validated && errors.cardNumber ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                  placeholder="4111 2222 3333 4444"
                />
                {validated && errors.cardNumber && <span className="text-[10px] text-red-500 mt-1 block">{errors.cardNumber}</span>}
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      maxLength="5"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                        validated && errors.cardExpiry ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                      placeholder="MM/YY"
                    />
                    {validated && errors.cardExpiry && <span className="text-[10px] text-red-500 mt-1 block">{errors.cardExpiry}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1.5">CVV Code</label>
                    <input
                      type="password"
                      name="cardCvv"
                      maxLength="3"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors ${
                        validated && errors.cardCvv ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                      placeholder="123"
                    />
                    {validated && errors.cardCvv && <span className="text-[10px] text-red-500 mt-1 block">{errors.cardCvv}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice checkout side summary */}
        <div className="flex flex-col gap-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 rounded-3xl p-6 shadow-sm">
          <h3 className="font-extrabold text-base text-zinc-950 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
            Confirm Order
          </h3>

          {/* List items briefly */}
          <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center gap-4 text-xs font-medium">
                <div className="flex flex-col min-w-0">
                  <span className="text-zinc-800 dark:text-zinc-200 font-bold truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Qty: {item.quantity} x ${item.price.toFixed(2)}
                  </span>
                </div>
                <span className="font-black text-zinc-800 dark:text-zinc-200">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 my-1" />

          {/* Invoice calculations */}
          <div className="flex flex-col gap-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-zinc-900 dark:text-zinc-100">${subtotal.toFixed(2)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount ({appliedCoupon.code})</span>
                <span>
                  {appliedCoupon.type === 'percent' ? `-$${discount.toFixed(2)}` : 'Waived Delivery'}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="text-zinc-900 dark:text-zinc-100">${gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{deliveryCharges === 0 ? '$0.00' : `$${deliveryCharges.toFixed(2)}`}</span>
            </div>

            <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 my-1" />

            <div className="flex justify-between items-baseline text-sm font-black text-zinc-950 dark:text-white">
              <span className="text-xs font-bold text-zinc-800">Grand Total</span>
              <span className="text-lg">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            type="submit"
            className="w-full mt-4 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold text-sm shadow-md shadow-violet-500/20 hover:scale-[1.01] hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Place Order</span>
            <span>(${grandTotal.toFixed(2)})</span>
          </button>
        </div>
      </form>
    </div>
  );
}
