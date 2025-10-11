# SriFurnitureVillage Backend

Node.js + Express + MongoDB + Cloudinary backend for Sri Furniture Village. Ready for local dev and deployment (Render/Railway).

## Quick Start

1. Copy `.env.example` to `.env` and fill values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```

2. Install deps and run:

```
npm install
npm run dev
```

3. Health check: `GET /api/health`

## API Overview

- `GET /api/products?category=sofa` – list products by category slug/name
- `GET /api/products/:id` – get one product
- `POST /api/products` – create (admin only, Bearer token). Multipart field `image` or `imageUrl`
- `PUT /api/products/:id` – update (admin only)
- `DELETE /api/products/:id` – delete (admin only)

- `GET /api/categories` – list categories
- `POST /api/categories` – create (admin only)
- `DELETE /api/categories/:id` – delete (admin only)

- `POST /api/auth/admin/login` – returns JWT for admin
- `POST /api/auth/admin/seed` – one-time create first admin

- `GET /api/orders` – list (admin only)
- `POST /api/orders` – create order (customer)

## Admin Auth

Use `POST /api/auth/admin/login` with admin credentials to get a JWT. Include as `Authorization: Bearer <token>` for admin endpoints.

## Cloudinary Uploads

Send multipart form-data with field `image` to `POST /api/products`. Files are streamed to Cloudinary and the `secure_url` is saved.

## Frontend Integration

- Set `CLIENT_ORIGIN` to your frontend origin for CORS
- From React, fetch `GET /api/products?category=wooden-sofas` etc.


