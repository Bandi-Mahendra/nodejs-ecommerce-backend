# API Documentation

Base URL: `http://localhost:5000`

All responses use:

```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Error message"
}
```

Authenticated endpoints require `Authorization: Bearer <token>`.

## Authentication

### Register User

`POST /api/auth/register`

Auth: Public

Body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

You can also send `multipart/form-data` with the same text fields and up to 5 image files under the `images` field.

Success: `201 Created`.

### Login User

`POST /api/auth/login`

Auth: Public

Body:

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Success includes a JWT token and user summary.

### Get Profile

`GET /api/auth/profile`

Auth: User.

### Update Profile

`PUT /api/auth/profile`

Auth: User

Body:

```json
{
  "name": "Jane Updated",
  "phone": "9999999999",
  "address": {
    "address": "12 Market Road",
    "city": "Mumbai",
    "postalCode": "400001",
    "country": "India"
  }
}
```

### Change Password

`PUT /api/auth/change-password`

Auth: User

Body:

```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

## Products

### Create Product

`POST /api/products`

Auth: Admin

Body:

```json
{
  "name": "Wireless Mouse",
  "description": "Comfortable wireless mouse for daily productivity.",
  "price": 29.99,
  "category": "Accessories",
  "brand": "Arena",
  "images": ["https://example.com/mouse.jpg"],
  "stock": 25
}
```

### Get Products

`GET /api/products`

Auth: Public

Query parameters:

| Name | Description |
| --- | --- |
| `keyword` | Search name, description, and category |
| `category` | Filter by category |
| `minPrice` | Minimum price |
| `maxPrice` | Maximum price |
| `sort` | `price_asc`, `price_desc`, `newest`, `oldest` |
| `page` | Page number |
| `limit` | Items per page |

Example: `/api/products?keyword=mouse&category=Accessories&sort=price_asc&page=1&limit=10`

### Get Product

`GET /api/products/:id`

Auth: Public.

### Update Product

`PUT /api/products/:id`

Auth: Admin. Body can include any product fields.

For image replacement, send `multipart/form-data` with files under the `images` field. Uploaded image paths replace the current `images` array.

### Delete Product

`DELETE /api/products/:id`

Auth: Admin.

### Add Review

`POST /api/products/:id/reviews`

Auth: User

Body:

```json
{
  "rating": 5,
  "comment": "Excellent quality."
}
```

### Delete Review

`DELETE /api/products/:productId/reviews/:reviewId`

Auth: Review owner or admin.

## Cart

### View Cart

`GET /api/cart`

Auth: User.

### Add To Cart

`POST /api/cart`

Auth: User

Body:

```json
{
  "productId": "64f000000000000000000001",
  "quantity": 2
}
```

### Update Cart Quantity

`PUT /api/cart/:productId`

Auth: User

Body:

```json
{
  "quantity": 3
}
```

### Remove From Cart

`DELETE /api/cart/:productId`

Auth: User.

## Orders

### Create Order / Checkout

`POST /api/orders`

Auth: User

Body:

```json
{
  "shippingAddress": {
    "address": "12 Market Road",
    "city": "Mumbai",
    "postalCode": "400001",
    "country": "India"
  },
  "paymentMethod": "card",
  "simulatePayment": true
}
```

Set `simulatePayment` to `false` to receive a payment failure response.

### Order History

`GET /api/orders`

Auth: User.

### Get Order Details

`GET /api/orders/:id`

Auth: User or admin.

### Cancel Order

`PUT /api/orders/:id/cancel`

Auth: User. Only processing orders can be cancelled.

### List All Orders

`GET /api/orders/admin/all`

Auth: Admin.

### Update Order Status

`PUT /api/orders/:id/status`

Auth: Admin

Body:

```json
{
  "status": "shipped"
}
```

Allowed values: `processing`, `shipped`, `delivered`, `cancelled`.

## Admin

### Dashboard Summary

`GET /api/admin/dashboard`

Auth: Admin

Response data:

```json
{
  "totalUsers": 10,
  "totalProducts": 25,
  "totalOrders": 14,
  "revenue": 2150.5
}
```

## Common Errors

| Status | Meaning |
| --- | --- |
| `400` | Validation error or invalid request |
| `401` | Missing or invalid authentication |
| `402` | Simulated payment failure |
| `403` | Role does not have access |
| `404` | Resource not found |
| `409` | Duplicate resource |
| `429` | Too many requests |
