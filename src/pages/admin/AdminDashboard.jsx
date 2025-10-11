import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dashboard stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    stock: 0,
    sku: '',
    material: '',
    seater: '',
    dimensionsInch: '',
    dimensionsCm: '',
    warranty: '',
    deliveryTime: '',
    deliveryCondition: '',
    brand: '',
    careInstructions: '',
    colors: [],
    sizes: [],
    images: [],
    imageFiles: []
  });
  
  // Dynamic form states
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: ''
  });

  const API_BASE = 'http://localhost:5000/api';
  const token = localStorage.getItem('adminToken');

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const getAuthHeadersFormData = () => ({
    'Authorization': `Bearer ${token}`
  });

  // Helper functions for dynamic form management
  const addColor = () => {
    if (newColor.trim() && !productForm.colors.includes(newColor.trim())) {
      setProductForm({ ...productForm, colors: [...productForm.colors, newColor.trim()] });
      setNewColor('');
    }
  };

  const removeColor = (colorToRemove) => {
    setProductForm({ 
      ...productForm, 
      colors: productForm.colors.filter(color => color !== colorToRemove) 
    });
  };

  const addSize = () => {
    if (newSize.trim() && !productForm.sizes.includes(newSize.trim())) {
      setProductForm({ ...productForm, sizes: [...productForm.sizes, newSize.trim()] });
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove) => {
    setProductForm({ 
      ...productForm, 
      sizes: productForm.sizes.filter(size => size !== sizeToRemove) 
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    
    setProductForm({ ...productForm, imageFiles: files });
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImagePreview = (index) => {
    const newFiles = productForm.imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setProductForm({ ...productForm, imageFiles: newFiles });
    setImagePreviews(newPreviews);
  };

  const resetProductForm = () => {
    setProductForm({
      title: '',
      description: '',
      price: '',
      salePrice: '',
      category: '',
      stock: 0,
      sku: '',
      material: '',
      seater: '',
      dimensionsInch: '',
      dimensionsCm: '',
      warranty: '',
      deliveryTime: '',
      deliveryCondition: '',
      brand: '',
      careInstructions: '',
      colors: [],
      sizes: [],
      images: [],
      imageFiles: []
    });
    setNewColor('');
    setNewSize('');
    setImagePreviews([]);
  };

  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    loadData();
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      await axios.get(`${API_BASE}/health`);
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        axios.get(`${API_BASE}/products`, { headers: getAuthHeaders() }),
        axios.get(`${API_BASE}/categories`),
        axios.get(`${API_BASE}/orders`, { headers: getAuthHeaders() })
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setOrders(ordersRes.data);

      setStats({
        totalProducts: productsRes.data.length,
        totalCategories: categoriesRes.data.length,
        totalOrders: ordersRes.data.length,
        totalRevenue: ordersRes.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Product functions
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!productForm.title || !productForm.description || !productForm.price || !productForm.category) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate that at least one image is provided
    if (productForm.imageFiles.length === 0) {
      setError('Please upload at least one product image');
      return;
    }

    const formData = new FormData();
    
    // Required fields that backend expects
    formData.append('title', productForm.title);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('category', productForm.category);
    formData.append('stock', productForm.stock);
    
    // Add the first image as the main image (backend expects 'image' field)
    if (productForm.imageFiles.length > 0) {
      formData.append('image', productForm.imageFiles[0]);
    }

    try {
      if (editingProduct) {
        await axios.put(`${API_BASE}/products/${editingProduct._id}`, formData, {
          headers: getAuthHeadersFormData()
        });
        setSuccess('Product updated successfully!');
      } else {
        await axios.post(`${API_BASE}/products`, formData, {
          headers: getAuthHeadersFormData()
        });
        setSuccess('Product added successfully!');
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      resetProductForm();
      loadData();
    } catch (error) {
      console.error('Product save error:', error);
      if (error.code === 'ERR_CONNECTION_REFUSED') {
        setError('Backend server is not running. Please start the backend server first.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        handleLogout();
      } else {
        setError(error.response?.data?.error || 'Failed to save product. Please try again.');
      }
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price,
      salePrice: '', // Not stored in backend yet
      category: product.category?.slug || product.category,
      stock: product.stock,
      sku: '', // Not stored in backend yet
      material: '', // Not stored in backend yet
      seater: '', // Not stored in backend yet
      dimensionsInch: '', // Not stored in backend yet
      dimensionsCm: '', // Not stored in backend yet
      warranty: '', // Not stored in backend yet
      deliveryTime: '', // Not stored in backend yet
      deliveryCondition: '', // Not stored in backend yet
      brand: '', // Not stored in backend yet
      careInstructions: '', // Not stored in backend yet
      colors: [], // Not stored in backend yet
      sizes: [], // Not stored in backend yet
      images: [], // Not stored in backend yet
      imageFiles: []
    });
    
    // Set existing image as preview
    if (product.imageUrl) {
      setImagePreviews([product.imageUrl]);
    } else {
      setImagePreviews([]);
    }
    
    setNewColor('');
    setNewSize('');
    setShowProductForm(true);
  };

  const handleProductDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE}/products/${id}`, {
          headers: getAuthHeaders()
        });
        setSuccess('Product deleted successfully!');
        loadData();
      } catch (error) {
        setError('Failed to delete product');
      }
    }
  };

  // Category functions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_BASE}/categories`, categoryForm, {
        headers: getAuthHeaders()
      });
      setSuccess('Category added successfully!');
      setShowCategoryForm(false);
      setCategoryForm({ name: '', slug: '' });
      loadData();
    } catch (error) {
      console.error('Category save error:', error);
      setError(error.response?.data?.error || 'Failed to save category');
    }
  };

  const handleCategoryDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_BASE}/categories/${id}`, {
          headers: getAuthHeaders()
        });
        setSuccess('Category deleted successfully!');
        loadData();
      } catch (error) {
        setError('Failed to delete category');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sri Furniture Village - Admin Panel
              </h1>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600 mr-2">Backend Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  backendStatus === 'connected' ? 'bg-green-100 text-green-800' :
                  backendStatus === 'disconnected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {backendStatus === 'connected' ? '✅ Connected' :
                   backendStatus === 'disconnected' ? '❌ Disconnected' :
                   '⏳ Checking...'}
                </span>
                {backendStatus === 'disconnected' && (
                  <button
                    onClick={checkBackendStatus}
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'products', label: 'Products' },
              { id: 'categories', label: 'Categories' },
              { id: 'orders', label: 'Orders' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">P</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalProducts}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">C</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalCategories}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">O</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">₹</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="text-lg font-medium text-gray-900">₹{stats.totalRevenue.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                  >
                    Manage Products
                  </button>
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                  >
                    Manage Categories
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                  >
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
              <button
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                  resetProductForm();
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Add New Product
              </button>
            </div>

            {/* Enhanced Product Form */}
            {showProductForm && (
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  {/* Backend Compatibility Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Backend Compatibility Notice
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Currently, only basic product information (Title, Description, Price, Category, Stock, Image) 
                            is saved to the backend. The additional fields below are prepared for future backend integration.
                            Only the first uploaded image will be saved as the main product image.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleProductSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                        Basic Information
                      </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Title <span className="text-red-500">*</span>
                          </label>
                        <input
                          type="text"
                          value={productForm.title}
                          onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                            placeholder="Enter product title"
                        />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU (Optional)
                          </label>
                        <input
                            type="text"
                            value={productForm.sku}
                            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., SF-SOFA-001"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows="3"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                          placeholder="Enter product description"
                      />
                    </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sale Price (₹) (Optional)
                          </label>
                          <input
                            type="number"
                            value={productForm.salePrice}
                            onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity
                          </label>
                          <input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat.slug}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Product Specifications Section */}
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">2</span>
                        Product Specifications
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Material (Optional)</label>
                        <input
                            type="text"
                            value={productForm.material}
                            onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., Solid Wood, MDF, Leather"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Seater/Size (Optional)</label>
                          <input
                            type="text"
                            value={productForm.seater}
                            onChange={(e) => setProductForm({ ...productForm, seater: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., 3 Seater, King Size"
                        />
                      </div>
                    </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (Inches) (Optional)</label>
                          <input
                            type="text"
                            value={productForm.dimensionsInch}
                            onChange={(e) => setProductForm({ ...productForm, dimensionsInch: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., 72 x 36 x 30 inches"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (CM) (Optional)</label>
                          <input
                            type="text"
                            value={productForm.dimensionsCm}
                            onChange={(e) => setProductForm({ ...productForm, dimensionsCm: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., 183 x 91 x 76 cm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Color Options Section */}
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">3</span>
                        Color Options
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {productForm.colors.map((color, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {color}
                            <button
                              type="button"
                              onClick={() => removeColor(color)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          placeholder="Add color (e.g., Natural, Stone, Wood)"
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                        />
                        <button
                          type="button"
                          onClick={addColor}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Add Color
                        </button>
                      </div>
                    </div>

                    {/* Size Options Section */}
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="bg-yellow-100 text-yellow-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">4</span>
                        Size Options
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {productForm.sizes.map((size, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {size}
                            <button
                              type="button"
                              onClick={() => removeSize(size)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          placeholder="Add size (e.g., 4 Seater Dining, King Size)"
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                        />
                        <button
                          type="button"
                          onClick={addSize}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Add Size
                        </button>
                      </div>
                    </div>

                    {/* Product Images Section */}
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">5</span>
                        Product Image (First image will be saved)
                      </h4>
                      
                      {/* Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => removeImagePreview(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Select images (first image will be saved to backend, others are for preview)
                      </p>
                    </div>

                    {/* Additional Information Section */}
                    <div className="pb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">6</span>
                        Additional Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Warranty (Optional)</label>
                          <input
                            type="text"
                            value={productForm.warranty}
                            onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., 1 Year Manufacturer Warranty"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Brand (Optional)</label>
                          <input
                            type="text"
                            value={productForm.brand}
                            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., Sri Furniture Village"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (Optional)</label>
                          <input
                            type="text"
                            value={productForm.deliveryTime}
                            onChange={(e) => setProductForm({ ...productForm, deliveryTime: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., 7-10 business days"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Condition (Optional)</label>
                          <input
                            type="text"
                            value={productForm.deliveryCondition}
                            onChange={(e) => setProductForm({ ...productForm, deliveryCondition: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., Free delivery within city"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions (Optional)</label>
                        <textarea
                          value={productForm.careInstructions}
                          onChange={(e) => setProductForm({ ...productForm, careInstructions: e.target.value })}
                          rows="3"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter care and maintenance instructions"
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          resetProductForm();
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
                      >
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">All Products</h3>
                {loading ? (
                  <div className="text-center py-4">Loading products...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="h-12 w-12 rounded-lg object-cover"
                                onError={(e) => {
                                  // prevent infinite loop in case placeholder also fails
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
                                  // Log the broken URL for debugging
                                  // eslint-disable-next-line no-console
                                  console.warn('Product image failed to load:', product.imageUrl);
                                }}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.category?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{product.price?.toLocaleString() || '0'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.stock || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleProductEdit(product)}
                                className="text-orange-600 hover:text-orange-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleProductDelete(product._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Add New Category
              </button>
            </div>

            {/* Category Form */}
            {showCategoryForm && (
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Category</h3>
                  <form onSubmit={handleCategorySubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                          type="text"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL-friendly)</label>
                        <input
                          type="text"
                          value={categoryForm.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          placeholder="e.g., wooden-sofas"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowCategoryForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                      >
                        Add Category
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Categories List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">All Categories</h3>
                {loading ? (
                  <div className="text-center py-4">Loading categories...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                          <tr key={category._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {category.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {category.slug}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleCategoryDelete(category._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">All Orders</h3>
                {loading ? (
                  <div className="text-center py-4">Loading orders...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order._id.slice(-8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.userId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.items?.length || 0} items
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{(order.totalAmount || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;