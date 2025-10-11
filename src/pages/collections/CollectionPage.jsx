import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { category } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch products for the specific category
      const data = await productsAPI.getProducts(category);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryName = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryEmoji = (categorySlug) => {
    const emojiMap = {
      'wooden-sofas': '🛋️',
      'bedroom-furniture': '🛏️',
      'dining-furniture': '🪑',
      'office-furniture': '💼',
      'outdoor-furniture': '🌳',
      'storage-furniture': '📦',
      'kids-furniture': '🧸'
    };
    return emojiMap[categorySlug] || '🪑';
  };

  const getCategoryGradient = (categorySlug) => {
    const gradientMap = {
      'wooden-sofas': 'from-amber-100 to-orange-200',
      'bedroom-furniture': 'from-blue-100 to-indigo-200',
      'dining-furniture': 'from-green-100 to-emerald-200',
      'office-furniture': 'from-gray-100 to-slate-200',
      'outdoor-furniture': 'from-green-100 to-teal-200',
      'storage-furniture': 'from-purple-100 to-violet-200',
      'kids-furniture': 'from-pink-100 to-rose-200'
    };
    return gradientMap[categorySlug] || 'from-gray-100 to-slate-200';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = (product) => {
    if (product.salePrice && product.price > product.salePrice) {
      return Math.round(((product.price - product.salePrice) / product.price) * 100);
    }
    return 0;
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product._id,
      name: product.title,
      price: product.salePrice || product.price,
      image: product.imageUrl,
      quantity: 1,
      sku: product.sku || 'SFV-' + product._id.slice(-6),
      originalPrice: product.price
    };
    
    addToCart(cartItem);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span className="mx-2">/</span>
            <a href="#" className="hover:text-gray-900">Collections</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{formatCategoryName(category)}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {formatCategoryName(category)}
          </h1>
          <p className="text-gray-600">
            Discover our premium collection of {formatCategoryName(category).toLowerCase()}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {products.length} Products
          </p>
          <select className="border border-gray-300 rounded px-4 py-2 text-sm">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={loadProducts}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="text-6xl mb-4">{getCategoryEmoji(category)}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                No products are currently available in the {formatCategoryName(category)} category.
              </p>
              <p className="text-sm text-gray-500">
                Check back later or browse other categories.
              </p>
            </div>
          ) : (
            products.map((product) => {
              const discount = calculateDiscount(product);
              const currentPrice = product.salePrice || product.price;
              
              return (
                <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden group">
                  <div className="relative">
                    <div className={`h-64 bg-gradient-to-br ${getCategoryGradient(category)} flex items-center justify-center overflow-hidden`}>
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.title || product.name} 
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-6xl">{getCategoryEmoji(category)}</span>
                      )}
                    </div>
                    
                    {/* Sale Badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {discount}% OFF
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col space-y-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-700" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {product.title || product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-orange-600 font-bold text-lg">
                        {formatPrice(currentPrice)}
                      </span>
                      {discount > 0 && (
                        <span className="text-gray-500 text-sm line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-center font-semibold hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </Link>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;