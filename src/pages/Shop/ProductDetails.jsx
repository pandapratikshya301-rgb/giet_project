import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetails({ cart, addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) {
          throw new Error('Product not found or API error.');
        }
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.images && data.images.length > 0 ? data.images[0] : data.thumbnail);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-zinc-500">Retrieving details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <span className="text-4xl">📭</span>
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Failed to Load Details</h3>
        <p className="text-sm text-zinc-500 max-w-sm text-center">{error || 'Please check your connection and try again.'}</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm shadow-md hover:bg-violet-700 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div className="w-full pb-20 animate-fade-in">
      {/* Navigation and Back link */}
      <div className="mb-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-violet-500 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main product core block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850/80 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Left Side: Images Gallery */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[4/3] sm:aspect-square bg-zinc-50 dark:bg-zinc-950 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-100 dark:border-zinc-850">
            <img
              src={activeImage}
              alt={product.title}
              className="object-contain w-full h-full p-4 transition-all duration-300"
            />
          </div>

          {/* Thumbnail strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative flex-shrink-0 h-20 w-20 bg-zinc-50 dark:bg-zinc-950 border rounded-xl overflow-hidden cursor-pointer flex items-center justify-center p-1.5 transition-all ${
                    activeImage === imgUrl
                      ? 'border-violet-600 ring-2 ring-violet-500/10'
                      : 'border-zinc-200 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="object-contain w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details info details */}
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            {/* Header tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-violet-50 dark:bg-zinc-800 text-violet-600 dark:text-violet-400 font-extrabold text-[10px] tracking-wider uppercase">
                {product.category}
              </span>
              {product.stock <= 5 && (
                <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold text-[10px] tracking-wider uppercase animate-pulse">
                  Only {product.stock} Left!
                </span>
              )}
            </div>

            {/* Title & Brand */}
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
              {product.title}
            </h1>
            <div className="mt-1 flex items-center gap-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              <span>Brand: <strong className="text-zinc-600 dark:text-zinc-300">{product.brand || 'Generic'}</strong></span>
              <span>•</span>
              <span>SKU: <strong>{product.sku}</strong></span>
            </div>

            {/* Rating summary */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center text-sm font-bold bg-amber-500/15 text-amber-600 px-2.5 py-1 rounded-lg">
                <span className="text-xs mr-1">★</span>
                <span>{product.rating.toFixed(2)}</span>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                ({product.reviews ? product.reviews.length : 0} verified customer reviews)
              </span>
            </div>

            {/* Prices block */}
            <div className="mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-zinc-950 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-xs text-zinc-400 dark:text-zinc-600 line-through">
                    Original Price: ${originalPrice}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold tracking-wider uppercase">
                  Save {Math.round(product.discountPercentage)}% Off
                </span>
              )}
            </div>

            {/* Add to Cart Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Qty controller */}
              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm h-12">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-850 font-bold text-lg text-zinc-500 cursor-pointer select-none"
                >
                  －
                </button>
                <span className="px-4 font-bold text-sm text-zinc-800 dark:text-zinc-200 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-850 font-bold text-lg text-zinc-500 cursor-pointer select-none"
                >
                  ＋
                </button>
              </div>

              {/* Add CTA button */}
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 min-w-[200px] h-12 rounded-xl bg-violet-600 text-white font-bold text-sm shadow-md shadow-violet-500/20 hover:bg-violet-700 hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Add to Cart</span>
                <span className="text-xs font-normal opacity-75">| Qty: {quantity}</span>
              </button>
            </div>
          </div>

          {/* Quick logistics highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800/80 pt-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="text-sm">🚚</span>
              <div>{product.shippingInformation || 'Standard Shipping'}</div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="text-sm">↩️</span>
              <div>{product.returnPolicy || '30-Day Return Window'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs segment: Description, Specifications, Reviews */}
      <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850/80 rounded-3xl p-6 shadow-sm">
        {/* Tab Headers */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800/80 gap-6 pb-2 mb-6">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold capitalize relative cursor-pointer transition-all ${
                activeTab === tab
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400 rounded-full animate-scale-x" />
              )}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div>
          {activeTab === 'description' && (
            <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
              <p>{product.description}</p>
              <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
                Category: <strong className="capitalize">{product.category}</strong>. Weight: {product.weight}g.
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
              <div className="flex justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-400">Dimensions</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {product.dimensions?.width}w x {product.dimensions?.height}h x {product.dimensions?.depth}d cm
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-400">Warranty</span>
                <span className="text-zinc-700 dark:text-zinc-300">{product.warrantyInformation || 'N/A'}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-400">Weight</span>
                <span className="text-zinc-700 dark:text-zinc-300">{product.weight} grams</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850">
                <span className="text-zinc-400">Availability</span>
                <span className={`font-bold ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="flex flex-col gap-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 font-extrabold text-[10px] flex items-center justify-center uppercase">
                          {rev.reviewerName.charAt(0)}
                        </span>
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {rev.reviewerName}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        {new Date(rev.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex gap-1 text-xs text-amber-400 font-bold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-zinc-400">
                  No customer reviews yet. Be the first to review!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
