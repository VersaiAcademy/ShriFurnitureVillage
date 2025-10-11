import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // 🏷️ Basic Fields (existing)
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    imageUrl: { type: String, required: true },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // 💰 New Pricing Fields
    salePrice: { type: Number, default: null }, // Optional discounted price
    sku: { type: String, trim: true, unique: false }, // Optional SKU identifier

    // 🪵 Product Details
    material: { type: String, trim: true },
    seater: { type: String, trim: true }, // e.g., "3-Seater", "L-Shaped"
    dimensionsInch: { type: String, trim: true },
    dimensionsCm: { type: String, trim: true },
    warranty: { type: String, trim: true },

    // 🚚 Delivery & Brand Info
    deliveryTime: { type: String, trim: true },
    deliveryCondition: { type: String, trim: true },
    brand: { type: String, trim: true },

    // 🧼 Care Instructions
    care: { type: String, trim: true },

    // 🎨 Dynamic Options
    colors: [{ type: String, trim: true }], // array of color names
    sizes: [{ type: String, trim: true }], // array of size labels

    // 🖼️ Multiple Images Support
    images: [{ type: String, trim: true }], // all images
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
