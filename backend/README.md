# Laundry Order Management Backend

Express.js backend scaffold for the Laundry Order Management System.

## Objective

Provide a simple dry cleaning store backend that supports:
- Creating orders
- Tracking order status
- Calculating billing totals
- Viewing basic dashboard metrics

## Setup Instructions

1. Open a terminal in the project root.
2. Change to the backend folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. The API will listen on `http://localhost:3000` by default.

> Optional: add a `.env` file next to `src/server.js` if you want to override `PORT` or `NODE_ENV`.

## Features Implemented

- Order management
  - Create orders with customer references and item-level billing
  - Update orders and delete orders
  - Track order status through: `RECEIVED`, `PROCESSING`, `READY`, `DELIVERED`
- Filtering
  - List orders by status
  - Search orders by customer name or customer phone
- Billing
  - Calculate `subtotal`, `tax`, `discount`, and `total`
- Dashboard
  - Return total orders, total revenue, and orders per status
- Customer management
  - Create, list, update, and delete customers
- Basic auth placeholder
  - `POST /api/auth/login`
  - `POST /api/auth/register`

## Important endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/orders` - supports `status`, `customerName`, and `customerPhone` query filters
- `POST /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id`
- `PATCH /api/orders/:id/status` - updates order status to one of: `RECEIVED`, `PROCESSING`, `READY`, `DELIVERED`
- `DELETE /api/orders/:id`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/customers/:id`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`
- `GET /api/dashboard`

## AI Usage Report

- Tools used:
  - GitHub Copilot for code generation and file scaffolding
  - ChatGPT-style assistance for architecture design, feature planning, and README composition
- Sample prompts:
  - "Design a backend structure first for express js"
  - "Build a simple system that allows a dry cleaning store to create orders, track order status, calculate billing, and view basic dashboard data"
  - "Add order status management and filtering by status/customer name/phone"
- What the AI got wrong:
  - Initial status values were implemented as lowercase and not aligned with the requested uppercase workflow
  - The first order list endpoint did not include customer-based filtering
  - Customer lookup was not fully integrated with order filtering until the next iteration
- What was improved:
  - Corrected status names to `RECEIVED`, `PROCESSING`, `READY`, `DELIVERED`
  - Added a dedicated `PATCH /api/orders/:id/status` route
  - Implemented order filtering by customer name and phone
  - Added dashboard metrics and clarified endpoint documentation

## Tradeoffs

- What was skipped:
  - No real database persistence; the current backend uses in-memory models for orders and customers
  - No production-grade authentication, authorization, or token validation
  - No validation library such as Joi or Zod; basic manual validation is used instead
- What I'd improve with more time:
  - Replace in-memory models with a real database (SQLite, PostgreSQL, or MongoDB)
  - Add request validation middleware and more robust error handling
  - Add unit tests and API contract tests
  - Add customer/order seed data and sample Postman / curl examples
  - Improve auth to support real login/register flows and secure user sessions

## Run

```bash
cd backend
npm install
npm run dev
```
