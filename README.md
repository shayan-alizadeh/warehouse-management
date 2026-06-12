# 📦 Warehouse Management System API

A robust, RESTful API backend for a Warehouse and Inventory Management System. Built with Node.js, Express, and Sequelize ORM, this system handles products, categories, contacts (people), and complex invoice transactions with centralized error handling and localization utilities.

## 🚀 Features

- **Inventory Management**: Full CRUD operations for Stuffs (Products) and Categories.
- **Contact Management**: Manage People (customers, suppliers, or staff) involved in transactions.
- **Invoice & Transactions**: Handle purchase and sales invoices with dynamic price calculations and relational data mapping (Invoice Items).
- **Reporting**: Generate reports based on entities (e.g., reports by specific person, category, or stuff).
- **Centralized Error Handling**: Custom database error parser (`parseDBError`) to return user-friendly, localized (Persian) error messages for constraints like duplicates or foreign key violations.
- **Global Validation Middleware**: Automatically intercepts and validates query parameters (`page`, `limit`) and route parameters (`:id`) to ensure they are valid positive integers.
- **Localization Utilities**: Built-in helpers for Persian/English number conversion, price formatting, and URL slugification.
- **Standardized Responses**: Custom response middleware ensures all API responses follow a consistent success/fail format.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: MySQL
- **Environment**: dotenv

## 📂 Project Structure

````text
├── controllers/      # Route handlers (Categories, Invoices, People, Stuffs, Reports)
├── middlewares/      # Custom middlewares (cors, standardized responses)
├── models/           # Sequelize Models & Relationships (Category, Invoice, Person, Stuff)
├── routes/           # Express routers defining API endpoints
├── utils/            # Helper functions (db connection, text formatters, error parsers)
├── data.js           # Seed data for initial database population
└── app.js            # Application entry point & configuration
````

## 🔗 API Endpoints (Base URL: `/api/v1`)

| Resource | Endpoints | Description |
| :--- | :--- | :--- |
| **Categories** | `/categories` | Manage product categories. |
| **People** | `/people` | Manage contacts/persons. |
| **Stuffs** | `/stuffs` | Manage inventory items/products. |
| **Invoices** | `/invoices` | Manage invoices and transaction items. |
| **Reports** | `/reports` | Get analytical data and relational reports. |
| **Misc** | `/misc` | Miscellaneous helper routes. |

> **Note**: Most `GET` endpoints support pagination via `?page=x&limit=y` query parameters.

## ⚙️ Installation & Setup

1. **Clone the repository:**

```bash
   git clone https://github.com/YourUsername/warehouse-management-api.git
   cd warehouse-management-api
```

2. **Install dependencies:**

```bash
   npm install
```

3. **Configure Environment Variables:Create a .env file in the root directory and add your database credentials:**

```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=warehouse_db
```

4. **Run the Application:**

```bash
   npm start
   # or using nodemon for development
   npm run dev
```
