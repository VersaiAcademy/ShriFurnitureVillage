import React from 'react';

const WoodenSofas = () => {
  const products = [
    { id: 1, name: 'Classic Wooden Sofa 3+1+1', price: '₹45,000' },
    { id: 2, name: 'L-Shaped Wooden Sofa', price: '₹55,000' },
    { id: 3, name: 'Modern Wooden Sofa Set', price: '₹48,000' },
    { id: 4, name: 'Traditional Wooden Sofa', price: '₹42,000' },
    { id: 5, name: 'Sofa Cum Bed', price: '₹38,000' },
    { id: 6, name: 'Premium Wooden Sofa', price: '₹65,000' },
  ];

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
            <span className="text-gray-900 font-medium">Wooden Sofas</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wooden Sofas
          </h1>
          <p className="text-gray-600">
            Discover our premium collection of handcrafted wooden sofas
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
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                <span className="text-6xl">🛋️</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-orange-600 font-bold text-lg mb-4">
                  {product.price}
                </p>
                <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WoodenSofas;