# E-commerce Backend API

A production-ready REST API for an e-commerce application built with Node.js, Express, MongoDB, Mongoose, JWT authentication, role-based authorization, cart management, orders, payment simulation, reviews, inventory tracking, and admin dashboard metrics.

## Features

- User registration, login, profile update, and password changes
- JWT-protected routes with user and admin roles
- Product CRUD with search, category filtering, price/date sorting, and pagination
- Product image upload with Multer; stored files are served from `/uploads/products`
- Shopping cart with stock-aware quantity updates
- Checkout, order history, order details, cancellation, and status tracking
- Payment simulation with paid, failed, and refunded states
- Reviews with average rating calculation
- Admin dashboard summary for users, products, orders, and revenue
- Centralized errors, consistent JSON responses, validation, sanitization, Helmet, CORS, and rate limiting

## Tech Stack

Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator, helmet, cors, express-rate-limit, Jest, Supertest.

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Update `.env` with your MongoDB connection string and a strong `JWT_SECRET`.

## Environment Variables

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development`, `test`, or `production` |
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT lifetime, for example `7d` |
| `CORS_ORIGIN` | Comma-separated allowed origins or `*` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds |
| `RATE_LIMIT_MAX` | Max requests per window |

## Running Locally

```bash
npm run dev
```

The API runs at `http://localhost:5000` by default.

## Testing

```bash
npm test
```

Tests use `mongodb-memory-server`, Jest, and Supertest, so they do not require a local MongoDB instance.

## Core Endpoints

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/auth/profile` | User |
| `PUT` | `/api/auth/profile` | User |
| `PUT` | `/api/auth/change-password` | User |
| `GET` | `/api/products` | Public |
| `GET` | `/api/products/:id` | Public |
| `POST` | `/api/products` | Admin |
| `PUT` | `/api/products/:id` | Admin |
| `DELETE` | `/api/products/:id` | Admin |
| `POST` | `/api/products/:id/reviews` | User |
| `DELETE` | `/api/products/:productId/reviews/:reviewId` | Review owner or admin |
| `GET` | `/api/cart` | User |
| `POST` | `/api/cart` | User |
| `PUT` | `/api/cart/:productId` | User |
| `DELETE` | `/api/cart/:productId` | User |
| `POST` | `/api/orders` | User |
| `GET` | `/api/orders` | User |
| `GET` | `/api/orders/:id` | User/Admin |
| `PUT` | `/api/orders/:id/cancel` | User |
| `GET` | `/api/orders/admin/all` | Admin |
| `PUT` | `/api/orders/:id/status` | Admin |
| `GET` | `/api/admin/dashboard` | Admin |

## Database Setup

Use MongoDB Atlas or a local MongoDB server. Add the URI to `.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_backend
```

## Deployment

The project is ready for Render or Railway:

1. Create a new Node.js service from this repository.
2. Set build command to `npm install`.
3. Set start command to `npm start`.
4. Add all environment variables from `.env.example`.
5. Use MongoDB Atlas for the production database.

Full API details are available in [docs/api-documentation.md](docs/api-documentation.md).

## Product Image Upload

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
