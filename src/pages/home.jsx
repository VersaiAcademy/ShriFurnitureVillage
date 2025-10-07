import React from 'react';

const Home = () => {
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
          <a href="/collections/wooden-sofas" className="group">
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
          </a>

          <a href="/collections/queen-size-beds" className="group">
            <div className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <span className="text-6xl">🛏️</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600">
                  Beds
                </h3>
                <p className="text-gray-600 mt-2">
                  Luxurious Bedroom Furniture
                </p>
              </div>
            </div>
          </a>

          <a href="/collections/dining-tables" className="group">
            <div className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                <span className="text-6xl">🪑</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600">
                  Dining
                </h3>
                <p className="text-gray-600 mt-2">
                  Elegant Dining Sets
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Products
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Wooden Sofa Set
                  </h3>
                  <p className="text-orange-600 font-bold">₹45,000</p>
                  <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;