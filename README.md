# Storefront Backend API

## Project Description

This project is a RESTful backend API for an online storefront. It allows clients to manage products, users, orders, and cart/order product relationships.

The project uses PostgreSQL for data storage, Express for routing, TypeScript for type safety, bcrypt for password hashing, JSON Web Tokens for authentication, db-migrate for database migrations, and Jasmine/Supertest for testing.

---

## Technologies Used

- Node.js
- Express
- TypeScript
- PostgreSQL
- db-migrate
- bcrypt
- JSON Web Tokens
- Jasmine
- Supertest
- Docker

---

## Ports

The backend API runs on:

```text
http://localhost:3000
```

PostgreSQL runs on:

```text
5432
```

---

## Database Setup

Create the development and test databases:

```sql
CREATE DATABASE storefront_dev;
CREATE DATABASE storefront_test;
```

When using Docker, the `storefront_dev` database is created automatically by `docker-compose.yml`. The `storefront_test` database should be created manually using the command shown in the Docker setup section.

---

## Environment Variables

Create a `.env` file in the root of the project with the following values:

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
ENV=dev

BCRYPT_PASSWORD=storefront_secret
SALT_ROUNDS=10
TOKEN_SECRET=storefront_token_secret
```

The `.env` file is included in `.gitignore` and should not be committed.

Database migration configuration is stored in `database.js`, which reads database connection values from `.env`.

---

## Installation

Install dependencies:

```bash
yarn install
```

If Yarn is not installed, install it globally:

```bash
npm install -g yarn
```

Then run:

```bash
yarn install
```

---

## Running Locally with Docker

This project can be run locally using Docker for PostgreSQL and Node/Yarn for the API.

### 1. Start Docker Desktop

Make sure Docker Desktop is running.

### 2. Start the PostgreSQL container

From the project root, run:

```bash
docker compose up -d
```

Check that the container is running:

```bash
docker ps
```

You should see a container named:

```text
storefront_postgres
```

### 3. Create the test database

The Docker container creates `storefront_dev` automatically. Create the test database manually:

```bash
docker exec -it storefront_postgres psql -U postgres -c "CREATE DATABASE storefront_test;"
```

If the database already exists, this step can be skipped.

### 4. Install dependencies

```bash
yarn install
```

### 5. Run migrations

```bash
yarn migrate
```

### 6. Build the project

```bash
yarn build
```

### 7. Run tests

```bash
yarn test
```

Expected result:

```text
50 specs, 0 failures
```

### 8. Start the API

For development watch mode:

```bash
yarn watch
```

Or run the compiled app:

```bash
yarn build
yarn start
```

Then open:

```text
http://localhost:3000
```

You should see:

```text
Storefront Backend API
```

---

## Useful Docker Commands

Start the PostgreSQL container:

```bash
docker compose up -d
```

Stop the PostgreSQL container:

```bash
docker compose down
```

Stop the PostgreSQL container and delete its local database volume:

```bash
docker compose down -v
```

Use `docker compose down -v` only when you want to reset the local database completely.

Open a PostgreSQL shell inside the container:

```bash
docker exec -it storefront_postgres psql -U postgres
```

List databases:

```bash
docker exec -it storefront_postgres psql -U postgres -c "\l"
```

List tables in the development database:

```bash
docker exec -it storefront_postgres psql -U postgres -d storefront_dev -c "\dt"
```

---

## Local Database Notes

The project uses Docker PostgreSQL with the following local connection values:

```text
Host: 127.0.0.1
Port: 5432
Development database: storefront_dev
Test database: storefront_test
User: postgres
Password: stored in .env
```

If a local Windows PostgreSQL service is already running on port `5432`, it can conflict with Docker PostgreSQL. Stop the local PostgreSQL service or change the Docker port mapping.

---

## Database Migrations

Run migrations:

```bash
yarn migrate
```

Reset migrations:

```bash
yarn migrate:reset
```

The migration files create the following tables:

- products
- users
- orders
- order_products

---

## Running the Application

Build the TypeScript project:

```bash
yarn build
```

Start the compiled server:

```bash
yarn start
```

For development watch mode:

```bash
yarn watch
```

---

## Running Tests

Run all tests:

```bash
yarn test
```

The test command:

1. Sets the environment to `test`
2. Runs migrations against the test database
3. Builds TypeScript
4. Runs Jasmine tests
5. Resets the test database

Expected result:

```text
50 specs, 0 failures
```

---

## API Endpoints

### Products

| Method | Route | Description | Token Required |
|---|---|---|---|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get one product | No |
| POST | `/products` | Create product | Yes |
| PUT | `/products/:id` | Update product | Yes |
| DELETE | `/products/:id` | Delete product | Yes |
| GET | `/products/category/:category` | Get products by category | No |

### Users

| Method | Route | Description | Token Required |
|---|---|---|---|
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get one user | Yes |
| POST | `/users` | Create user and return token | No |
| PUT | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes |
| POST | `/users/authenticate` | Authenticate user and return token | No |

### Orders

| Method | Route | Description | Token Required |
|---|---|---|---|
| GET | `/orders` | Get all orders | Yes |
| GET | `/orders/:id` | Get one order | Yes |
| POST | `/orders` | Create order | Yes |
| PUT | `/orders/:id` | Update order | Yes |
| DELETE | `/orders/:id` | Delete order | Yes |
| POST | `/orders/:id/products` | Add product to order | Yes |
| GET | `/users/:id/orders/current` | Get current active order by user | Yes |
| GET | `/users/:id/orders/completed` | Get completed orders by user | Yes |

### Dashboard

| Method | Route | Description | Token Required |
|---|---|---|---|
| GET | `/dashboard/products/popular` | Get top 5 popular products | No |

---

## Authentication

Protected routes require a JWT token in the `Authorization` header:

```text
Authorization: Bearer <token>
```

Tokens are returned by:

- `POST /users`
- `POST /users/authenticate`

---