import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Get all products and show first 8 as featured
      const products = await productsAPI.getProducts();
      setFeaturedProducts(products.slice(0, 8));
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setLoading(false);
    }
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
    <div>
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to Sri Furniture Village
            </h1>
            <p className="text-xl text-gray-700">
              Premium Wooden Furniture for Your Home
            </p>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/collections/wooden-sofas" className="group">
            <div className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                <span className="text-6xl">🛋️</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600">
                  Sofas
                </h3>
                <p className="text-gray-600 mt-2">
                  Comfortable & Stylish Sofas
                </p>
              </div>
            </div>
          </Link>

          <Link to="/collections/bedroom-furniture" className="group">
            <div className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <span className="text-6xl">🛏️</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600">
                  Bedroom
                </h3>
                <p className="text-gray-600 mt-2">
                  Luxurious Bedroom Furniture
                </p>
              </div>
            </div>
          </Link>

          <Link to="/collections/dining-furniture" className="group">
            <div className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                <span className="text-6xl">🪑</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600">
                  Dining & Kitchen
                </h3>
                <p className="text-gray-600 mt-2">
                  Elegant Dining Sets
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Products
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🪑</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
              <p className="text-gray-600 mb-4">
                We're working on adding amazing furniture to our collection.
              </p>
              <p className="text-sm text-gray-500">
                Check back soon for our latest arrivals!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const discount = calculateDiscount(product);
                const currentPrice = product.salePrice || product.price;
                
                return (
                  <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="relative">
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">🪑</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Sale Badge */}
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {discount}% OFF
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex flex-col space-y-1">
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
                        {product.title}
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
                          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-center font-semibold hover:bg-gray-200 transition-colors text-sm"
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Products Button */}
          {featuredProducts.length > 0 && (
            <div className="text-center mt-8">
              <Link
                to="/collections"
                className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Choose Sri Furniture Village?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌳</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600">
              Handcrafted furniture made from the finest materials
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Delivery</h3>
            <p className="text-gray-600">
              Complimentary delivery on orders above ₹5,000
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Warranty</h3>
            <p className="text-gray-600">
              Comprehensive warranty on all our furniture pieces
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;