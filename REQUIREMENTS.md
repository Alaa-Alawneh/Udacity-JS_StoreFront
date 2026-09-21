# Storefront Backend API Requirements

## Overview

This API supports an online storefront. It allows the frontend to manage products, users, orders, authentication, and cart/order functionality.

The API is built with:

- Node.js
- Express
- TypeScript
- PostgreSQL
- db-migrate
- bcrypt
- JSON Web Tokens

---

## Database Schema

### products

| Column | Type | Rules |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| price | INTEGER | NOT NULL |
| category | VARCHAR(100) | OPTIONAL |

### users

| Column | Type | Rules |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| password_digest | VARCHAR | NOT NULL |

Passwords are stored as bcrypt hashes in `password_digest`.

### orders

| Column | Type | Rules |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| user_id | BIGINT | REFERENCES users(id), NOT NULL |
| status | VARCHAR(50) | NOT NULL |

Order status values:

- active
- complete

### order_products

| Column | Type | Rules |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| quantity | INTEGER | NOT NULL |
| order_id | BIGINT | REFERENCES orders(id), NOT NULL |
| product_id | BIGINT | REFERENCES products(id), NOT NULL |

---

## API Endpoints

### Products

| Method | Route | Description | Token Required |
|---|---|---|---|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get one product by id | No |
| POST | `/products` | Create product | Yes |
| PUT | `/products/:id` | Update product | Yes |
| DELETE | `/products/:id` | Delete product | Yes |
| GET | `/products/category/:category` | Get products by category | No |

### Users

| Method | Route | Description | Token Required |
|---|---|---|---|
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get one user by id | Yes |
| POST | `/users` | Create user and return token | No |
| PUT | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes |
| POST | `/users/authenticate` | Authenticate user and return token | No |

### Orders

| Method | Route | Description | Token Required |
|---|---|---|---|
| GET | `/orders` | Get all orders | Yes |
| GET | `/orders/:id` | Get one order by id | Yes |
| POST | `/orders` | Create order | Yes |
| PUT | `/orders/:id` | Update order | Yes |
| DELETE | `/orders/:id` | Delete order | Yes |
| POST | `/orders/:id/products` | Add product to order | Yes |
| GET | `/users/:id/orders/current` | Get active order by user | Yes |
| GET | `/users/:id/orders/completed` | Get completed orders by user | Yes |

### Dashboard

| Method | Route | Description | Token Required |
|---|---|---|---|
| GET | `/dashboard/products/popular` | Get top 5 popular products | No |

---

## Data Shapes

### Product

```ts
{
  id?: number
  name: string
  price: number
  category?: string
}
```

### User

```ts
{
  id?: number
  first_name: string
  last_name: string
  password?: string
  password_digest?: string
}
```

### Order

```ts
{
  id?: number
  user_id: number
  status: string
}
```

### OrderProduct

```ts
{
  id?: number
  quantity: number
  order_id: number
  product_id: number
}
```

---

## Authentication

Protected routes require a JWT in the Authorization header:

```text
Authorization: Bearer <token>
```

A token is returned from:

- POST /users
- POST /users/authenticate
