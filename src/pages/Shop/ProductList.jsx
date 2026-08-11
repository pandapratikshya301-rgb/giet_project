import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProductList({ cart, addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products based on search or category selection
  const fetchProducts = async (search = '', category = 'all') => {
    setLoading(true);
    try {
      let url = 'https://dummyjson.com/products?limit=30';
      
      if (search) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`;
      } else if (category !== 'all') {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories list on mount
  useEffect(() => {
    const fetchCategoriesList = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products/category-list');
        if (res.ok) {
          const list = await res.json();
          // Take top 8 categories for clean UI presentation
          setCategories(['all', ...list.slice(0, 8)]);
        } else {
          // Fallback categories if API fails or behaves differently
          setCategories(['all', 'beauty', 'fragrances', 'furniture', 'groceries', 'laptops', 'smartphones']);
        }
      } catch (err) {
        setCategories(['all', 'beauty', 'fragrances', 'furniture', 'groceries']);
      }
    };
    fetchCategoriesList();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setSearchQuery('');
      setAppliedSearch('');
    }
    fetchProducts('', selectedCategory);
  }, [selectedCategory]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedCategory('all');
    setAppliedSearch(searchQuery);
    fetchProducts(searchQuery, 'all');
  };

  // Clear search and reset list
  const handleClearSearch = () => {
    setSearchQuery('');
    setAppliedSearch('');
    fetchProducts('', 'all');
  };

  return (
    <div className="w-full pb-16 animate-fade-in">
      {/* Promotional Banner */}
      <div className="w-full p-4 mb-8 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="text-center sm:text-left">
          <h3 className="font-extrabold text-lg">🎉 Monsoon Megastore Deals!</h3>
          <p className="text-xs text-white/95 mt-1">Get massive savings today. Apply discount codes at checkout!</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-black tracking-wider border border-white/10 uppercase">
            SAVE10 (10% OFF)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-black tracking-wider border border-white/10 uppercase">
            GIET20 (20% OFF)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-black tracking-wider border border-white/10 uppercase">
            FREESHIP (Free Delivery)
          </span>
        </div>
      </div>

      {/* Search and Categories Row */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products (e.g., phone, perfume)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-sm focus:outline-none focus:border-violet-500 transition-all shadow-sm"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-violet-600 text-white font-semibold text-sm shadow-md hover:bg-violet-700 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Categories Pills */}
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-white border border-zinc-200/60 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Info context message */}
      {appliedSearch && (
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Search results for: </span>
          <strong className="text-zinc-800 dark:text-zinc-200">"{appliedSearch}"</strong>
          <button
            onClick={handleClearSearch}
            className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="w-full py-24 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-zinc-500 animate-pulse">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="w-full py-24 border border-dashed border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">🏜️</span>
          <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">No Products Found</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">We couldn't find matches. Try adjusting your terms or categories.</p>
          <button
            onClick={handleClearSearch}
            className="mt-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Reset Catalog
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => {
            const hasDiscount = item.discountPercentage > 0;
            const originalPrice = hasDiscount
              ? (item.price / (1 - item.discountPercentage / 100)).toFixed(2)
              : null;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 hover:border-violet-500/30 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                {/* Product Image Wrapper */}
                <div className="relative w-full aspect-square bg-zinc-100 dark:bg-zinc-950 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 px-2 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-black text-white shadow-sm uppercase tracking-wider">
                      -{Math.round(item.discountPercentage)}% Off
                    </span>
                  )}
                  <Link
                    to={`/shop/product/${item.id}`}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <span className="px-4 py-2 rounded-full bg-white text-zinc-900 font-bold text-xs shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      Quick View
                    </span>
                  </Link>
                </div>

                {/* Info and action */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category pill */}
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-violet-600 dark:text-violet-400">
                      {item.category.replace('-', ' ')}
                    </span>
                    {/* Title */}
                    <h4 className="mt-1 font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-violet-500 transition-colors line-clamp-1">
                      <Link to={`/shop/product/${item.id}`}>{item.title}</Link>
                    </h4>
                    {/* Description excerpt */}
                    <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    {/* Rating stars & reviews */}
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                      <span className="text-amber-400 text-xs">★</span>
                      <span>{item.rating.toFixed(1)}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">|</span>
                      <span>{item.brand || 'Generic'}</span>
                    </div>

                    {/* Price and Add button */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-zinc-950 dark:text-white">
                            ${item.price.toFixed(2)}
                          </span>
                          {originalPrice && (
                            <span className="text-xs text-zinc-400 dark:text-zinc-600 line-through">
                              ${originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="h-9 w-9 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-600 dark:bg-zinc-850 dark:hover:bg-violet-950/40 dark:text-violet-400 hover:scale-105 border border-violet-100 dark:border-zinc-800 transition-all flex items-center justify-center font-bold cursor-pointer"
                        title="Add to Cart"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
