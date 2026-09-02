# E-commerce Backend API

## 📌 Overview
A production-ready REST API for e-commerce, built with Node.js, Express, and MongoDB.  
Includes authentication, product management, cart, orders, payments, reviews, and admin dashboard metrics.

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- express-validator
- Helmet, CORS, express-rate-limit
- Jest + Supertest (testing)

## ✨ Features
- User registration, login, profile update, and password changes
- JWT-protected routes with user and admin roles
- Product CRUD with search, category filtering, price/date sorting, and pagination
- Product image upload with Multer; stored files served from `/uploads/products`
- Shopping cart with stock-aware quantity updates
- Checkout, order history, order details, cancellation, and status tracking
- Payment simulation with paid, failed, and refunded states
- Reviews with average rating calculation
- Admin dashboard summary for users, products, orders, and revenue
- Centralized error handling, consistent JSON responses, validation, sanitization, Helmet, CORS, and rate limiting

## 🚀 Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/Bandi-Mahendra/nodejs-ecommerce-backend.git
   cd nodejs-ecommerce-backend
   ```   
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variable:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your MongoDB connection string and a strong `JWT_SECRET`.

## ⚙️ Environment Variables

| Variable | Description |
| --- | --- |
| NODE_ENV | development, test, or production |
| PORT | Server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret used to sign JWTs |
| JWT_EXPIRES_IN | JWT lifetime (e.g., 7d) |
| CORS_ORIGIN | Comma-separated allowed origins or * |
| RATE_LIMIT_WINDOW_MS | Rate limit window in milliseconds |
| RATE_LIMIT_MAX | Max requests per window |

## 🖥️ Running Locally

```bash
npm run dev
```

The API runs at `http://localhost:5000` by default.

## 🧪 Testing

```bash
npm test
```

Tests use `mongodb-memory-server`, Jest, and Supertest, so they do not require a local MongoDB instance.

## 🔑 Core Endpoints

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | User |
| PUT | /api/auth/profile | User |
| PUT | /api/auth/change-password | User |
| GET | /api/products | Public |
| GET | /api/products/:id | Public |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |
| POST | /api/products/:id/reviews | User |
| DELETE | /api/products/:productId/reviews/:reviewId | Review owner/Admin |
| GET | /api/cart | User |
| POST | /api/cart | User |
| PUT | /api/cart/:productId | User |
| DELETE | /api/cart/:productId | User |
| POST | /api/orders | User |
| GET | /api/orders | User |
| GET | /api/orders/:id | User/Admin |
| PUT | /api/orders/:id/cancel | User |
| GET | /api/orders/admin/all | Admin |
| PUT | /api/orders/:id/status | Admin |
| GET | /api/admin/dashboard | Admin |


## 🗄️ Database Setup

Use MongoDB Atlas or a local MongoDB server. Add the URI to `.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_backend
```

## 🌐 Deployment

Ready for Render or Railway:

- Create a new Node.js service from this repository.
- Set build command to `npm install`.
- Set start command to `npm start`.
- Add all environment variables from `.env.example`.
- Use MongoDB Atlas for the production database.


## 📦 Product Image Upload

Create or update products with `multipart/form-data`. Use the field name `images` and upload up to 5 image files.

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <admin-token>" \
  -F "name=Wireless Mouse" \
  -F "description=Comfortable wireless mouse for daily productivity." \
  -F "price=29.99" \
  -F "category=Accessories" \
  -F "stock=25" \
  -F "images=@./mouse.jpg"
```

The database stores paths such as `/uploads/products/1720000000000-mouse.jpg`.

## 👤 Author
Bandi Mahendra  
Node.js E-Commerce Backend Project
