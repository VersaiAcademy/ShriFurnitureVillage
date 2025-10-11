// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Products API
export const productsAPI = {
  // Get all products or filter by category
  getProducts: async (category = null) => {
    try {
      const url = category ? `${API_BASE_URL}/products?category=${category}` : `${API_BASE_URL}/products`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  // Create product (admin only)
  createProduct: async (productData, imageFile = null) => {
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('stock', productData.stock || 0);
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (productData.imageUrl) {
      formData.append('imageUrl', productData.imageUrl);
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  // Update product (admin only)
  updateProduct: async (id, productData, imageFile = null) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData
    });

    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  }
};

// Categories API
export const categoriesAPI = {
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  createCategory: async (categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(categoryData)
    });

    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to delete category');
    return response.json();
  }
};

// Auth API
export const authAPI = {
  adminLogin: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      // If server provided { error: '...' } prefer that, otherwise use status text
      const msg = data?.error || data?.message || response.statusText || 'Invalid credentials';
      const err = new Error(msg);
      // attach response body for richer handling upstream
      err.response = { data };
      throw err;
    }
    return data;
  },

  createAdmin: async (adminData) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData)
    });

    if (!response.ok) throw new Error('Failed to create admin');
    return response.json();
  }
};

// Orders API
export const ordersAPI = {
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  }
};
