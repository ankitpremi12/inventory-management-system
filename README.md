# AP Solutions — Containerized Inventory & Order Management System

AP Solutions is a production-ready, full-stack, containerized **Inventory & Order Management System** built with **FastAPI**, **PostgreSQL**, and **React**. The entire system is structured for simple orchestration using Docker Compose and prepared for free-tier cloud deployment.

> [!NOTE]
> **Access & Authentication:** Currently, this system provides open registration to demonstrate working functionality and workflows. Anyone can register and view the data. For a true production environment, access can easily be held or restricted by disabling open registration and introducing role-based access control (RBAC).

---

## 🔗 Project Links

| Resource | Link |
| :--- | :--- |
| **GitHub Repository** | [ankitpremi12/inventory-management-system](https://github.com/ankitpremi12/inventory-management-system) |
| **Backend Docker Hub Image** | [ankitpremi12/inventory-backend](https://hub.docker.com/r/ankitpremi12/inventory-backend) |
| **Frontend Hosted URL** | [inventory-management-system-8d9e.vercel.app](https://inventory-management-system-8d9e.vercel.app) |
| **Backend API Hosted URL** | [inventory-management-system-tbza.onrender.com](https://inventory-management-system-tbza.onrender.com) |

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

- **Backend API & PostgreSQL**: Deployed on **Render** (Free tier Web Service + PostgreSQL Database). Set the `REACT_APP_API_BASE_URL` environment variable in Vercel to point to your Render API URL.
- **Frontend Web App**: Deployed on **Vercel** at [inventory-management-system-8d9e.vercel.app](https://inventory-management-system-8d9e.vercel.app). A `vercel.json` at the root configures the build to use the `frontend/` directory and enables SPA routing.

---

## 6. GitHub Actions & Docker Hub CI/CD

The repository includes an automated GitHub Actions workflow in [.github/workflows/docker-publish.yml](file:///Users/ankitpremi/Downloads/ankit_inventory_system/.github/workflows/docker-publish.yml) that builds and publishes the backend Docker image to Docker Hub whenever changes are pushed to the `main` branch.

### Setting up GitHub Secrets

To enable the automated push, you need to add your Docker Hub credentials to your GitHub repository secrets:

1. **Generate a Docker Hub Access Token**:
   - Go to [Docker Hub](https://hub.docker.com/) and log in.
   - Click on your profile icon in the top right and go to **Account Settings** -> **Security** -> **Personal Access Tokens**.
   - Click **Create new token**, name it (e.g., `github-actions-ci`), and set permissions to **Read, Write, Delete** (or at least **Read & Write**).
   - Copy the generated token immediately (you won't be able to see it again).

2. **Add Secrets to GitHub**:
   - Open your repository on GitHub.
   - Go to **Settings** -> **Secrets and variables** -> **Actions**.
   - Click the **New repository secret** button.
   - Create a secret named **`DOCKERHUB_USERNAME`** and set its value to your Docker Hub username.
   - Click **New repository secret** again.
   - Create a secret named **`DOCKERHUB_TOKEN`** and set its value to the personal access token you copied in Step 1.

### How the Workflow Triggers

The workflow triggers automatically on a `git push` to the `main` branch if:
- Any file in the `backend/` folder changes.
- The workflow file itself (`.github/workflows/docker-publish.yml`) is modified.

Upon execution, GitHub Actions will:
1. Clone the repository.
2. Setup Docker Buildx.
3. Authenticate with Docker Hub using your configured secrets.
4. Build the backend image using the [backend/Dockerfile](file:///Users/ankitpremi/Downloads/ankit_inventory_system/backend/Dockerfile).
5. Tag and push the image to Docker Hub under the names:
   - `<your-dockerhub-username>/inventory-backend:latest`
   - `<your-dockerhub-username>/inventory-backend:<git-commit-sha>`

