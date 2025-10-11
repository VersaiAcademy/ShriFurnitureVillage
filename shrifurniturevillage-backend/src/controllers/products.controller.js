import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { configureCloudinary } from '../config/cloudinary.js';

// 🧾 List all products
export async function listProducts(req, res) {
  try {
    const { category, q } = req.query;
    const filter = { isActive: true };

    if (category) {
      const cat = await Category.findOne({ $or: [{ slug: category }, { name: category }] });
      filter.category = cat ? cat._id : null;
    }

    if (q) filter.title = { $regex: q, $options: 'i' };

    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    console.error('listProducts error', err);
    res.status(500).json({ error: 'Failed to list products' });
  }
}

// 🧾 Get single product
export async function getProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category');
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error('getProduct error', err);
    res.status(500).json({ error: 'Failed to get product' });
  }
}

// 🆕 Create Product
export async function createProduct(req, res) {
  try {
    const {
      title,
      description,
      price,
      stock,
      category,
      salePrice,
      sku,
      material,
      seater,
      dimensionsInch,
      dimensionsCm,
      warranty,
      deliveryTime,
      deliveryCondition,
      brand,
      care,
      colors,
      sizes,
    } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ✅ Category validation
    const catConditions = [{ slug: category }, { name: category }];
    if (mongoose.isValidObjectId(category)) catConditions.push({ _id: category });
    const categoryDoc = await Category.findOne({ $or: catConditions });
    if (!categoryDoc) return res.status(400).json({ error: 'Invalid category' });

    // ✅ Handle multiple image uploads (main + gallery)
    let imageUrl = null;
    let imageArray = [];

    if (req.files && req.files.length > 0) {
      const cloudinary = configureCloudinary();
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'shri-furniture/products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageArray.push(result.secure_url);
      }
      imageUrl = imageArray[0]; // First image = main image
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
      imageArray = [req.body.imageUrl];
    } else {
      return res.status(400).json({ error: 'Image is required' });
    }

    // ✅ Create product with all optional fields
    const created = await Product.create({
      title,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      sku,
      material,
      seater,
      dimensionsInch,
      dimensionsCm,
      warranty,
      deliveryTime,
      deliveryCondition,
      brand,
      care,
      colors: colors ? (Array.isArray(colors) ? colors : colors.split(',')) : [],
      sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',')) : [],
      category: categoryDoc._id,
      imageUrl,
      images: imageArray,
      stock: stock ? Number(stock) : 0,
    });

    res.status(201).json(created);
  } catch (err) {
    console.error('createProduct error', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

// 🛠️ Update Product
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Type conversions
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.salePrice !== undefined) updates.salePrice = Number(updates.salePrice);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    // Arrays for colors and sizes
    if (typeof updates.colors === 'string') {
      updates.colors = updates.colors.split(',').map(c => c.trim());
    }
    if (typeof updates.sizes === 'string') {
      updates.sizes = updates.sizes.split(',').map(s => s.trim());
    }

    // Handle category update
    if (updates.category) {
      const catConditions2 = [{ slug: updates.category }, { name: updates.category }];
      if (mongoose.isValidObjectId(updates.category)) catConditions2.push({ _id: updates.category });
      const cat = await Category.findOne({ $or: catConditions2 });
      if (!cat) return res.status(400).json({ error: 'Invalid category' });
      updates.category = cat._id;
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      const cloudinary = configureCloudinary();
      const uploadedUrls = [];
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'shri-furniture/products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        uploadedUrls.push(result.secure_url);
      }
      updates.imageUrl = uploadedUrls[0];
      updates.images = uploadedUrls;
    }

    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });

    res.json(updated);
  } catch (err) {
    console.error('updateProduct error', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

// ❌ Delete Product
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteProduct error', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}
