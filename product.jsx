import React, { useState } from 'react';
import auraHeadphones from './src/assets/aura_headphones.png';
import apexWatch from './src/assets/apex_watch.png';
import nebulaProjector from './src/assets/nebula_projector.png';
import shiftKeyboard from './src/assets/shift_keyboard.png';
import denimJacketMale from './src/assets/denim_jacket_male.png';
import windbreakerFemale from './src/assets/windbreaker_female.png';
import joggersKids from './src/assets/joggers_kids.png';
import toteFemale from './src/assets/tote_female.png';
import backpackKids from './src/assets/backpack_kids.png';

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Aura Sound Link',
    type: 'Tech',
    audience: 'Unisex',
    description: 'Immersive wireless headphones with high-res audio and signature matte-black & glowing neon design.',
    price: 24999,
    rating: 4.9,
    reviews: 142,
    image: auraHeadphones,
    accentColor: 'from-violet-500 to-fuchsia-500',
    shadowColor: 'rgba(139, 92, 246, 0.4)',
    borderHover: 'hover:border-violet-500/50'
  },
  {
    id: 'p2',
    name: 'Apex Chrono Smartwatch',
    type: 'Tech',
    audience: 'Unisex',
    description: 'Premium titanium case smartwatch featuring a holographic interface and active health tracking.',
    price: 29999,
    rating: 4.8,
    reviews: 98,
    image: apexWatch,
    accentColor: 'from-blue-500 to-cyan-500',
    shadowColor: 'rgba(59, 130, 246, 0.4)',
    borderHover: 'hover:border-blue-500/50'
  },
  {
    id: 'p3',
    name: 'Nebula Beam Projector',
    type: 'Tech',
    audience: 'Unisex',
    description: 'Pocket-sized ultra-short-throw projector producing 4K galaxy projection with rich ambient light.',
    price: 41999,
    rating: 4.7,
    reviews: 84,
    image: nebulaProjector,
    accentColor: 'from-emerald-500 to-teal-500',
    shadowColor: 'rgba(16, 185, 129, 0.4)',
    borderHover: 'hover:border-emerald-500/50'
  },
  {
    id: 'p4',
    name: 'Shift Mechanical Keyboard',
    type: 'Tech',
    audience: 'Unisex',
    description: 'Compact 75% hot-swappable keyboard with translucent keycaps and dynamic neon RGB backlight.',
    price: 15999,
    rating: 4.9,
    reviews: 215,
    image: shiftKeyboard,
    accentColor: 'from-amber-500 to-orange-500',
    shadowColor: 'rgba(245, 158, 11, 0.4)',
    borderHover: 'hover:border-amber-500/50'
  },
  {
    id: 'p5',
    name: 'Classic Denim Jacket',
    type: 'Clothes',
    audience: 'Male',
    description: 'Rugged, timeless dark indigo denim jacket crafted with premium heavy-grade cotton for a modern fit.',
    price: 4999,
    rating: 4.6,
    reviews: 73,
    image: denimJacketMale,
    accentColor: 'from-indigo-500 to-blue-600',
    shadowColor: 'rgba(79, 70, 229, 0.4)',
    borderHover: 'hover:border-indigo-500/50'
  },
  {
    id: 'p6',
    name: 'Aero Breeze Windbreaker',
    type: 'Clothes',
    audience: 'Female',
    description: 'Ultra-lightweight, waterproof windbreaker jacket in pastel lilac lavender color with adjustable hood.',
    price: 3499,
    rating: 4.8,
    reviews: 59,
    image: windbreakerFemale,
    accentColor: 'from-pink-500 to-rose-500',
    shadowColor: 'rgba(236, 72, 153, 0.4)',
    borderHover: 'hover:border-pink-500/50'
  },
  {
    id: 'p7',
    name: 'Dino Jogger Set',
    type: 'Clothes',
    audience: 'Children',
    description: 'Cozy organic cotton children jogger set including a dark teal dinosaur hoodie and matching sweatpants.',
    price: 1899,
    rating: 4.9,
    reviews: 120,
    image: joggersKids,
    accentColor: 'from-teal-500 to-emerald-500',
    shadowColor: 'rgba(20, 184, 166, 0.4)',
    borderHover: 'hover:border-teal-500/50'
  },
  {
    id: 'p8',
    name: 'Stellar Tote Bag',
    type: 'Accessories',
    audience: 'Female',
    description: 'Elegant cream white vegan leather shoulder bag accented with custom gold chain details and lining.',
    price: 2799,
    rating: 4.7,
    reviews: 41,
    image: toteFemale,
    accentColor: 'from-fuchsia-500 to-violet-500',
    shadowColor: 'rgba(217, 70, 239, 0.4)',
    borderHover: 'hover:border-fuchsia-500/50'
  },
  {
    id: 'p9',
    name: 'Nebula Space Backpack',
    type: 'Accessories',
    audience: 'Children',
    description: 'Navy blue children school backpack decorated with rocket ships and star patterns, complete with safety strips.',
    price: 1499,
    rating: 4.9,
    reviews: 86,
    image: backpackKids,
    accentColor: 'from-cyan-500 to-blue-500',
    shadowColor: 'rgba(6, 182, 212, 0.4)',
    borderHover: 'hover:border-cyan-500/50'
  }
];

function Product() {
  // Cart state: tracks current quantities of items in the cart
  const [cart, setCart] = useState({
    p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0, p8: 0, p9: 0
  });

  // Selection log state: tracks lifetime selection counts for each product
  const [selectionLog, setSelectionLog] = useState({
    p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0, p8: 0, p9: 0
  });

  // Filtering state
  const [activeAudience, setActiveAudience] = useState('All'); // All | Male | Female | Children | Unisex
  const [activeType, setActiveType] = useState('All'); // All | Tech | Clothes | Accessories

  // Handle adding an item
  const handleAddToCart = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: prevCart[productId] + 1,
    }));
    setSelectionLog((prevLog) => ({
      ...prevLog,
      [productId]: prevLog[productId] + 1,
    }));
  };

  // Handle removing / decrementing an item
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: Math.max(0, prevCart[productId] - 1),
    }));
  };

  // Handle completely clearing item from active cart
  const handleClearItem = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: 0,
    }));
  };

  // Reset Cart
  const handleClearAllCart = () => {
    setCart({
      p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0, p8: 0, p9: 0
    });
  };

  // Reset Selection Logs
  const handleClearAllLogs = () => {
    setSelectionLog({
      p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0, p8: 0, p9: 0
    });
  };

  // Calculate statistics
  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalSelectionClicks = Object.values(selectionLog).reduce((sum, qty) => sum + qty, 0);
  const cartSubtotal = PRODUCTS.reduce((sum, product) => {
    return sum + (cart[product.id] * product.price);
  }, 0);

  // Filter products list
  const filteredProducts = PRODUCTS.filter((product) => {
    const audienceMatch = activeAudience === 'All' || product.audience === activeAudience;
    const typeMatch = activeType === 'All' || product.type === activeType;
    return audienceMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-white pb-16">
      
      {/* Dynamic ambient backgrounds */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">NEO</span>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">STORE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#selection-dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              Engagement Dashboard
            </a>
            
            <div className="relative bg-slate-900 border border-slate-800 rounded-full px-4 py-2 flex items-center gap-2 hover:border-slate-700 transition-all duration-300">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="font-semibold text-sm">{totalCartItems}</span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* Banner Section */}
        <section className="mb-12 relative overflow-hidden rounded-3xl bg-slate-900/40 border border-slate-900 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-xl">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-violet-400 bg-violet-950/50 border border-violet-900 rounded-full">COLLECTIONS EXPANDED</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
              Explore Our All-New <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">Lifestyle Catalog</span>
            </h1>
            <p className="text-slate-400 leading-relaxed text-base">
              Discover activewear, premium tech components, and minimalist everyday accessories curated for the modern lifestyle. Filter by type or demographic to get started.
            </p>
          </div>
          
          <div className="relative z-10 bg-slate-950/60 backdrop-blur border border-slate-800/80 rounded-2xl p-6 w-full md:w-80 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-850">
              <span className="text-sm font-semibold text-slate-400">Lifetime Selections</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-violet-300 font-mono font-bold">{totalSelectionClicks}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-400">Cart Subtotal</span>
              <span className="text-lg font-bold text-white">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            <button 
              onClick={handleClearAllCart}
              disabled={totalCartItems === 0}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Current Cart
            </button>
          </div>
        </section>

        {/* Filter Section */}
        <section className="mb-10 bg-slate-900/10 border border-slate-900 p-6 rounded-3xl backdrop-blur-sm flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex flex-col gap-5 w-full">
            
            {/* Filter by Target Demographic */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider md:w-28">Demographic</span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Male', 'Female', 'Children', 'Unisex'].map((dem) => (
                  <button
                    key={dem}
                    onClick={() => setActiveAudience(dem)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      activeAudience === dem
                        ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/15'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {dem}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Product Types */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider md:w-28">Category</span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Tech', 'Clothes', 'Accessories'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      activeType === t
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/15'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

          </div>
          
          <div className="text-xs font-mono text-slate-500 self-end md:self-auto whitespace-nowrap">
            Showing {filteredProducts.length} of {PRODUCTS.length} products
          </div>
        </section>

        {/* Catalog List + Checkout Summary Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
          
          {/* Product Cards Catalog (Left 2 Columns) */}
          <div className="lg:col-span-2">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center bg-slate-900/10 border border-dashed border-slate-855 rounded-3xl">
                <svg className="w-12 h-12 text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                </svg>
                <p className="text-slate-400 text-sm font-semibold">No products match your active filters</p>
                <button
                  onClick={() => {
                    setActiveAudience('All');
                    setActiveType('All');
                  }}
                  className="mt-4 text-xs font-bold text-violet-400 hover:text-violet-300 underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => {
                  const activeCount = cart[product.id];
                  return (
                    <div 
                      key={product.id} 
                      className={`group relative flex flex-col bg-slate-900/20 backdrop-blur-sm border border-slate-900 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${product.borderHover}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 20px 40px -15px ${product.shadowColor}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Demographics & Category Tags */}
                      <div className="absolute top-4 left-4 z-10 flex gap-1.5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-slate-955/85 border border-slate-850 backdrop-blur-sm text-slate-300">
                          {product.type}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-slate-900/90 border border-slate-800 backdrop-blur-sm text-violet-400">
                          {product.audience}
                        </span>
                      </div>

                      {/* Image Frame */}
                      <div className="relative aspect-square overflow-hidden bg-slate-950/40 flex items-center justify-center p-6 border-b border-slate-900">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="object-contain w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent"></div>
                      </div>

                      {/* Product Content Details */}
                      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                        <div>
                          {/* Stars and Reviews */}
                          <div className="flex items-center gap-1.5 mb-2">
                            <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-semibold text-amber-300">{product.rating}</span>
                            <span className="text-[10px] text-slate-500">({product.reviews} reviews)</span>
                          </div>

                          <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                            {product.name}
                          </h3>
                          
                          <p className="text-xs text-slate-400 leading-relaxed mt-1">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xl font-black text-white">₹{product.price.toLocaleString('en-IN')}</span>
                          
                          {/* Card Add-to-cart operations */}
                          {activeCount === 0 ? (
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                              Add to Cart
                            </button>
                          ) : (
                            <div className="flex items-center bg-slate-900 border border-violet-500/30 rounded-xl p-1 gap-1.5">
                              <button
                                onClick={() => handleRemoveFromCart(product.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                              </button>
                              
                              <span className="w-6 text-center text-xs font-bold text-violet-400">{activeCount}</span>
                              
                              <button
                                onClick={() => handleAddToCart(product.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center bg-violet-600 text-white hover:bg-violet-500 transition-colors cursor-pointer"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Current Shopping Cart Overview (Right Column) */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 sticky top-24 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Active Cart
            </h2>

            {totalCartItems === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-600 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm font-semibold">Your cart is empty</p>
                <p className="text-slate-500 text-xs mt-1">Add items from the catalogue to get started</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {PRODUCTS.filter(p => cart[p.id] > 0).map((product) => {
                  const qty = cart[product.id];
                  return (
                    <div key={product.id} className="flex items-center gap-3 bg-slate-950/40 border border-slate-850 p-3 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center p-1 border border-slate-800">
                        <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500 font-mono">{qty} × ₹{product.price.toLocaleString('en-IN')}</span>
                          <span className="text-xs font-bold text-violet-400">₹{(qty * product.price).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleClearItem(product.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900/80 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}

                <div className="mt-4 pt-4 border-t border-slate-850 flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Items:</span>
                    <span className="text-white font-bold">{totalCartItems}</span>
                  </div>
                  <div className="flex justify-between text-base pt-1">
                    <span className="text-slate-300 font-semibold">Subtotal:</span>
                    <span className="text-violet-400 font-extrabold text-lg">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Checking out: ₹${cartSubtotal.toLocaleString('en-IN')}`)}
                  className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-500/25 active:scale-[0.98] transition-all cursor-pointer text-center"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Selection Logs Section (at the end) */}
        <section id="selection-dashboard" className="pt-8 border-t border-slate-900">
          <div className="flex flex-col gap-2 mb-8">
            <span className="px-3 py-1 self-start text-xs font-semibold bg-blue-950/40 text-blue-400 border border-blue-900 rounded-full">LIFETIME ACTIONS REPORT</span>
            <h2 className="text-2xl font-black text-white">Product Selection Logs</h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              This panel tracks how many times each product has been chosen for "Add to Cart". These stats persist even if you filter products, decrement active cart quantities, or clear your shopping cart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => {
              const count = selectionLog[product.id];
              const percentage = totalSelectionClicks > 0 ? (count / totalSelectionClicks) * 100 : 0;

              return (
                <div key={product.id} className="bg-slate-900/10 border border-slate-900 p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div className="flex justify-between items-start z-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center p-1.5">
                      <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 px-2 py-0.5 rounded-full bg-slate-900">
                        {product.type}
                      </span>
                      <span className="text-[8px] uppercase tracking-wider font-bold text-violet-400/80 px-1.5 py-0.2 rounded-full bg-violet-955/20 border border-violet-900/30">
                        {product.audience}
                      </span>
                    </div>
                  </div>

                  <div className="z-10 mt-2">
                    <h3 className="text-sm font-extrabold text-white truncate">{product.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{count}</span>
                      <span className="text-xs text-slate-500 font-semibold">selections</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-855 h-2 rounded-full overflow-hidden z-10 mt-auto">
                    <div 
                      className={`h-full bg-gradient-to-r ${product.accentColor} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage || 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono z-10">
                    <span>{percentage.toFixed(0)}% share</span>
                    <span>Active Cart: {cart[product.id]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggregated metrics bar */}
          <div className="mt-8 p-6 rounded-3xl bg-slate-900/20 border border-slate-900/60 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Metrics Overview</span>
              <p className="text-slate-300 text-sm">
                Active products in cart currently: <strong className="text-violet-400">{totalCartItems} items</strong>. Total selection interactions: <strong className="text-blue-400">{totalSelectionClicks} clicks</strong>.
              </p>
            </div>
            
            <button 
              onClick={handleClearAllLogs}
              disabled={totalSelectionClicks === 0}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-955/20 hover:bg-rose-600 border border-rose-900/60 hover:border-rose-500 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
              </svg>
              Reset Selection Counters
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Product;
