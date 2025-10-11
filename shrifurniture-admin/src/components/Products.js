import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
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
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, imageFiles: files });
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData({ ...formData, colors: [...formData.colors, newColor.trim()] });
      setNewColor('');
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData({ ...formData, colors: formData.colors.filter(color => color !== colorToRemove) });
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({ ...formData, sizes: [...formData.sizes, newSize.trim()] });
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove) => {
    setFormData({ ...formData, sizes: formData.sizes.filter(size => size !== sizeToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    
    // Add basic fields
    Object.keys(formData).forEach(key => {
      if (key !== 'imageFiles' && key !== 'images' && formData[key] !== null && formData[key] !== '') {
        if (Array.isArray(formData[key])) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });

    // Add image files
    formData.imageFiles.forEach((file, index) => {
      submitData.append(`image${index}`, file);
    });

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, submitData);
      } else {
        await axios.post('http://localhost:5000/api/products', submitData);
      }
      
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
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
    setImagePreviews([]);
    setNewColor('');
    setNewSize('');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      salePrice: product.salePrice || '',
      category: product.category?.slug || '',
      stock: product.stock || 0,
      sku: product.sku || '',
      material: product.material || '',
      seater: product.seater || '',
      dimensionsInch: product.dimensionsInch || '',
      dimensionsCm: product.dimensionsCm || '',
      warranty: product.warranty || '',
      deliveryTime: product.deliveryTime || '',
      deliveryCondition: product.deliveryCondition || '',
      brand: product.brand || '',
      careInstructions: product.careInstructions || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      images: product.images || [],
      imageFiles: []
    });
    setImagePreviews(product.images || []);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        loadProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Products Management</h2>
          <button 
            className="btn btn-success" 
            onClick={() => {
              setShowForm(true);
              setEditingProduct(null);
              resetForm();
            }}
          >
            Add New Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="form-section">
              <h4>Basic Information</h4>
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Bistro 4 Seater Dining Table Set"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  placeholder="Detailed product description..."
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="35000"
                  />
                </div>
                <div className="form-group">
                  <label>Sale Price (₹)</label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    placeholder="34999"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="10"
                  />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="SFV-1184-4-N"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="form-section">
              <h4>Product Specifications</h4>
              <div className="form-group">
                <label>Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="e.g., Solid Sheesham Wood"
                />
              </div>
              <div className="form-group">
                <label>Seater/Size</label>
                <input
                  type="text"
                  name="seater"
                  value={formData.seater}
                  onChange={handleInputChange}
                  placeholder="e.g., 4 Seater Dining"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Dimensions (Inches)</label>
                  <input
                    type="text"
                    name="dimensionsInch"
                    value={formData.dimensionsInch}
                    onChange={handleInputChange}
                    placeholder="L:33.5 x H:30 x W:33.5"
                  />
                </div>
                <div className="form-group">
                  <label>Dimensions (CM)</label>
                  <input
                    type="text"
                    name="dimensionsCm"
                    value={formData.dimensionsCm}
                    onChange={handleInputChange}
                    placeholder="L:85 x H:76 x W:85"
                  />
                </div>
              </div>
            </div>

            {/* Color Options */}
            <div className="form-section">
              <h4>Color Options</h4>
              <div className="form-group">
                <label>Add Color</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="e.g., Natural, Stone"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={addColor} className="btn btn-sm">
                    Add
                  </button>
                </div>
              </div>
              {formData.colors.length > 0 && (
                <div className="form-group">
                  <label>Selected Colors:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {formData.colors.map((color, index) => (
                      <span key={index} className="color-tag">
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          style={{ marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Size Options */}
            <div className="form-section">
              <h4>Size Options</h4>
              <div className="form-group">
                <label>Add Size</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="e.g., 4 Seater Dining, Dining Table"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={addSize} className="btn btn-sm">
                    Add
                  </button>
                </div>
              </div>
              {formData.sizes.length > 0 && (
                <div className="form-group">
                  <label>Selected Sizes:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {formData.sizes.map((size, index) => (
                      <span key={index} className="size-tag">
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          style={{ marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Images */}
            <div className="form-section">
              <h4>Product Images (Upload 3-5 images)</h4>
              <div className="form-group">
                <label>Select Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <small>You can select multiple images at once</small>
              </div>
              {imagePreviews.length > 0 && (
                <div className="form-group">
                  <label>Image Previews:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h4>Additional Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Warranty</label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="e.g., 36 Month Warranty"
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Time</label>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 10-12 Days"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Delivery Condition</label>
                <input
                  type="text"
                  name="deliveryCondition"
                  value={formData.deliveryCondition}
                  onChange={handleInputChange}
                  placeholder="e.g., Knocked Down"
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., SRI FURNITURE VILLAGE"
                />
              </div>
              <div className="form-group">
                <label>Care Instructions</label>
                <textarea
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="e.g., Professional Cleaning Only"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-success">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>All Products</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sale Price</th>
              <th>Stock</th>
              <th>SKU</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.category?.name}</td>
                <td>₹{product.price?.toLocaleString()}</td>
                <td>{product.salePrice ? `₹${product.salePrice.toLocaleString()}` : '-'}</td>
                <td>{product.stock}</td>
                <td>{product.sku || '-'}</td>
                <td>
                  <button 
                    className="btn" 
                    onClick={() => handleEdit(product)}
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .form-section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .form-section h4 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }
        .color-tag, .size-tag {
          background-color: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .form-group small {
          color: #666;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default Products;
