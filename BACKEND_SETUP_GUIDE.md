# 🚀 ShopFlow NestJS + MongoDB Backend Setup Guide

This document explains how to set up, seed, run, and connect the **NestJS + MongoDB** backend for ShopFlow.

---

## 🛠️ Tech Stack Included
* **Framework**: NestJS 12 (TypeScript)
* **Database**: MongoDB (via `@nestjs/mongoose` & Mongoose 9)
* **Authentication**: JWT & Passport (`@nestjs/jwt`, `passport-jwt`, `bcryptjs`)
* **Validation**: Class Validator & Class Transformer (`ValidationPipe`)

---

## 📁 Directory Structure
All backend code is located inside the dedicated `/backend` directory:
```
backend/
├── src/
│   ├── auth/         # Auth Controllers, JWT Strategy, Guards & Roles
│   ├── products/     # Products CRUD, Filters, Search & Inventory Management
│   ├── categories/   # Categories Management
│   ├── orders/       # Order Creation, Stock Decrement & Order Status
│   ├── schemas/      # Mongoose Schemas (User, Product, Category, Order, Review)
│   ├── seed.ts       # Database Seeder script
│   ├── app.module.ts # Root Module with MongoDB Connection
│   └── main.ts       # NestJS Entry point with CORS & ValidationPipe
├── .env              # Environment Configuration
├── package.json
└── tsconfig.json
```

---

## ⚡ Quick Start

### 1. Configure MongoDB Connection (`.env`)
Open `/backend/.env` and ensure your MongoDB URL is configured:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopflow
# Or for MongoDB Atlas cloud:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopflow?retryWrites=true&w=majority

JWT_SECRET=shopflow_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

---

### 2. Seed Initial Database Data
Run the seeder script to populate MongoDB with initial categories, products, and user credentials:
```bash
cd backend
npm run seed
```

**Seed Credentials Output:**
* 🔑 **Admin User**: `admin@shopflow.com` | Password: `admin123`
* 🔑 **Standard User**: `user@shopflow.com` | Password: `user123`

---

### 3. Run Backend Development Server
```bash
cd backend
npm run start:dev
```
The NestJS server will start on: **`http://localhost:5000/api`**

---

## 📡 Key API Endpoints

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` – Create user account & receive JWT token.
* `POST /api/auth/login` – Login & receive JWT token.
* `GET /api/auth/me` – Fetch authenticated user profile (Requires Bearer Token).

### 📦 Products & Categories (`/api/products`, `/api/categories`)
* `GET /api/products` – Public listing with search, category filtering, and sorting.
* `GET /api/products/slug/:slug` – Single product details by slug.
* `POST /api/products` – Create product (*Admin only*).
* `PUT /api/products/:id` – Update product (*Admin only*).
* `DELETE /api/products/:id` – Delete product (*Admin only*).
* `GET /api/categories` – List all product categories.

### 🛒 Orders (`/api/orders`)
* `POST /api/orders` – Place order (Validates stock & calculates total server-side).
* `GET /api/orders/my-orders` – Fetch authenticated user's order history.
* `GET /api/orders/admin/all` – Fetch all customer orders (*Admin only*).
* `PATCH /api/orders/:id/status` – Update order status (`pending`, `processing`, `shipped`, `delivered`) (*Admin only*).

---

## 🔗 Connecting Frontend to Backend
Set `NEXT_PUBLIC_API_URL` in your frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
All API helper calls use `lib/api.ts` to attach `Authorization: Bearer <token>` automatically.
