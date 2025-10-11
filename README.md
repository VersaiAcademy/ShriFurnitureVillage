# Sri Furniture Village - Complete E-commerce System

A full-stack furniture e-commerce platform with separate admin dashboard for product management.

## 🏗️ Project Structure

```
SriFurniture/
├── src/                          # Main Frontend (React + Tailwind)
│   ├── pages/
│   │   ├── collections/          # Category pages (WoodenSofas, BedroomFurniture, DiningFurniture)
│   │   └── admin/               # Admin pages (integrated)
│   ├── services/
│   │   └── api.js               # Backend API integration
│   └── components/             # React components
├── shrifurniturevillage-backend/ # Backend API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── models/             # MongoDB schemas
│   │   ├── controllers/        # API controllers
│   │   ├── routes/             # API routes
│   │   └── middleware/         # Auth & upload middleware
│   └── .env                    # Environment variables
└── shrifurniture-admin/        # Separate Admin Dashboard (React)
    ├── src/
    │   └── components/          # Admin UI components
    └── package.json
```

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd shrifurniturevillage-backend
npm install
npm run dev          # Starts server on http://localhost:5000
npm run seed         # Creates initial data (categories + admin user)
```

### 2. Main Frontend
```bash
npm install
npm run dev          # Starts frontend on http://localhost:5173
```

### 3. Admin Dashboard
```bash
cd shrifurniture-admin
npm install
npm start            # Starts admin panel on http://localhost:3000
```

## 🔑 Admin Access

**Default Admin Credentials:**
- Email: `admin@shrifurniture.com`
- Password: `admin123`

**Admin URLs:**
- Main Frontend Admin: `http://localhost:5173/admin`
- Separate Admin Dashboard: `http://localhost:3000`

## 📋 Features

### ✅ Backend API
- **Products Management**: CRUD operations with image uploads
- **Categories Management**: Dynamic category system
- **Orders Management**: Customer order tracking
- **Admin Authentication**: JWT-based admin login
- **Image Storage**: Cloudinary integration
- **Database**: MongoDB Atlas with Mongoose

### ✅ Frontend Integration
- **Dynamic Product Loading**: All category pages fetch from backend
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Loading States**: Skeleton loaders and error handling
- **Fallback Data**: Hardcoded products if API fails

### ✅ Admin Dashboard
- **Product Management**: Add, edit, delete products with images
- **Category Management**: Create and manage product categories
- **Order Tracking**: View customer orders
- **Dashboard Stats**: Overview of products, orders, revenue
- **Image Upload**: Direct Cloudinary integration

## 🌐 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products?category=sofas` - Filter by category
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Auth
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/admin/seed` - Create admin user

### Orders
- `GET /api/orders` - List orders (admin only)
- `POST /api/orders` - Create order (customer)

## 🗄️ Database Schema

### Products
```javascript
{
  title: String,
  description: String,
  price: Number,
  category: ObjectId (ref: Category),
  imageUrl: String,
  stock: Number,
  isActive: Boolean
}
```

### Categories
```javascript
{
  name: String,
  slug: String
}
```

### Orders
```javascript
{
  userId: String,
  items: [{
    product: ObjectId,
    quantity: Number,
    priceAtPurchase: Number
  }],
  totalAmount: Number,
  status: String,
  shippingAddress: Object
}
```

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=deagq2pwi
CLOUDINARY_API_KEY=123877637263241
CLOUDINARY_API_SECRET=n7UGuO4WpHUnSCrqQoVeie7ALOA
JWT_SECRET=shri_furniture_jwt_secret_key_2024
CLIENT_ORIGIN=http://localhost:5173
```

## 📱 Pages & Routes

### Main Website
- `/` - Home page with category links
- `/wooden-sofas` - Sofa products (dynamic from backend)
- `/bedroom-furniture` - Bedroom products (dynamic from backend)
- `/dining-furniture` - Dining products (dynamic from backend)
- `/admin` - Admin login/dashboard (integrated)

### Admin Dashboard
- `/` - Dashboard overview
- `/products` - Product management
- `/categories` - Category management
- `/orders` - Order management

## 🎯 How It Works

1. **Admin adds products** through admin dashboard with images
2. **Images upload to Cloudinary** automatically
3. **Product data saves to MongoDB** with category references
4. **Frontend pages fetch products** by category from backend API
5. **Products display dynamically** on category pages
6. **Customers can browse** and add to cart (Firebase integration)

## 🚀 Deployment Ready

- Backend can be deployed to Render/Railway
- Frontend can be deployed to Vercel/Netlify
- Admin dashboard can be deployed separately
- All environment variables configured
- MongoDB Atlas and Cloudinary ready for production

## 🔄 Data Flow

```
Admin Dashboard → Backend API → MongoDB Atlas
                     ↓
Frontend Pages ← Backend API ← Cloudinary (Images)
```

## 📞 Support

All components are connected and working together. The system is ready for production deployment with proper environment variables.