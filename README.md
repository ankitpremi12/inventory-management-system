# AP Solutions — Containerized Inventory & Order Management System

AP Solutions is a production-ready, full-stack, containerized **Inventory & Order Management System** built with **FastAPI**, **PostgreSQL**, and **React**. The entire system is structured for simple orchestration using Docker Compose and prepared for free-tier cloud deployment.

---

## 1. Features & Business Logic

### 1.1 Product Management
- **CRUD Operations**: Create, read, update, and delete products.
- **Fields**: Product name, SKU/code, Price, and Quantity in stock.
- **Business Rule**: Product SKU/code must be unique. Stock quantity cannot be negative.

### 1.2 Customer Management
- **CRUD Operations**: Create, view all, view by ID, and delete customers.
- **Fields**: Full name, Email address, and Phone number.
- **Business Rule**: Customer email must be unique.

### 1.3 Order Management
- **Creation & Tracking**: Create and view orders, and view itemized invoices.
- **Fields**: Customer reference, Product reference(s), Quantity ordered, and Total amount.
- **Business Rules**:
  - Automatically calculates total order amount by fetching current prices on the backend.
  - Validates stock levels before placing the order. Insufficient stock rejects order creation.
  - Automatically reduces available stock upon order creation inside a transaction block.
  - Deleting/canceling an order automatically restores the product stock back to the inventory.

### 1.4 Dashboard Overview
- **Real-Time KPI Cards**: Total Products, Total Customers, Total Orders.
- **Low Stock Alerts**: Displays warnings for products with stock &le; 10.
- **Overview Mix Chart**: Visual breakdown of records in the system.

---

## 2. Technology Stack

- **Backend**: Python 3.10, FastAPI, SQLAlchemy (ORM)
- **Frontend**: React (JS), TailwindCSS, Recharts, Nginx (production server)
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose

---

## 3. Repository Structure

```
├── backend/                  # FastAPI Application
│   ├── config.py             # Settings manager
│   ├── database.py           # DB connection & session maker
│   ├── models.py             # SQLAlchemy DB schemas
│   ├── schemas.py            # Pydantic validation schemas
│   ├── main.py               # REST API endpoints & business logic
│   ├── Dockerfile            # Python builder
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React Application
│   ├── src/                  # Components, pages, and UI utilities
│   ├── public/               # Static assets & HTML template
│   ├── nginx.conf            # Nginx routing configuration
│   └── Dockerfile            # Multi-stage React builder & server
└── docker-compose.yml        # Multi-service local orchestrator
```

---

## 4. Local Quick Start

To orchestrate and run the application locally:

1. **Prerequisites**: Make sure **Docker Desktop** is installed and running.
2. **Boot the Containers**: Run the following command in the project root:
   ```bash
   docker-compose up --build
   ```
3. **Services Access**:
   - **React Web App**: Open [http://localhost:3000](http://localhost:3000)
   - **Interactive API Documentation**: Open [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)
   - **PostgreSQL Database**: Port `5432` on `localhost` (User: `postgres`, Password: `postgres`, DB: `inventory_db`)

---

## 5. Deployment Setup

- **Backend API & PostgreSQL**: Deployed on **Render** (Free tier Web Service + PostgreSQL Database).
- **Frontend Web App**: Deployed on **Vercel** pointing to the Render API endpoint via `REACT_APP_API_BASE_URL` environment variable.
