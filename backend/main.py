from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from contextlib import asynccontextmanager
from decimal import Decimal

from .database import engine, Base, get_db
from . import models, schemas, config, auth, email_utils
from fastapi.security import OAuth2PasswordRequestForm
import secrets
from datetime import datetime, timedelta

# Create database tables if they do not exist
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="AP Solutions Inventory & Order Management System API",
    description="Backend API for managing products, customers, orders and pharmacy inventory",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration
# Per CORS spec: allow_credentials=True CANNOT be combined with allow_origins=["*"].
# Since we use JWT in Authorization headers (not cookies), we only need credentials=True
# when specific origins are set. With wildcard, credentials must be False.
_cors_origins = config.settings.CORS_ORIGINS
_use_credentials = "*" not in _cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=_use_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import RedirectResponse

# ── ROOT REDIRECT ─────────────────────────────────────────────────────────────

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

# ── AUTH ENDPOINTS ─────────────────────────────────────────────────────────────

@app.post("/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/forgot-password")
def forgot_password(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if user:
        token = secrets.token_urlsafe(32)
        user.reset_token = token
        user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        db.commit()
        email_utils.send_reset_email(user.email, token)
    # Always return a generic message to prevent email enumeration
    return {"message": "If an account with that email exists, a password reset link has been sent."}

@app.post("/auth/reset-password")
def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.reset_token == req.token).first()
    if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user.hashed_password = auth.get_password_hash(req.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    return {"message": "Password updated successfully."}


# ── PRODUCTS ENDPOINTS (existing) ──────────────────────────────────────────────

@app.post("/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Convert empty/whitespace SKU to None
    if product.sku:
        product.sku = product.sku.strip()
        if not product.sku:
            product.sku = None
    else:
        product.sku = None

    # Check uniqueness of SKU (only if not None)
    if product.sku is not None:
        db_product = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.sku == product.sku).first()
        if db_product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with SKU/code '{product.sku}' already exists."
            )
    
    new_product = models.Product(owner_id=current_user.id, **product.model_dump())
    new_product.sku = product.sku # Ensure None is written if converted
    db.add(new_product)
    try:
        db.commit()
        db.refresh(new_product)
        return new_product
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error during product creation."
        )

@app.get("/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Product).filter(models.Product.owner_id == current_user.id).all()

@app.get("/products/{product_id:int}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    product = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id:int} not found."
        )
    return product

@app.put("/products/{product_id:int}", response_model=schemas.ProductResponse)
def update_product(product_id: int, product_update: schemas.ProductUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    product = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id:int} not found."
        )
    
    update_data = product_update.model_dump(exclude_unset=True)
    
    # Strip and handle empty SKU
    if "sku" in update_data:
        val = update_data["sku"]
        if val:
            val = val.strip()
            if not val:
                val = None
        else:
            val = None
        update_data["sku"] = val

        # Check SKU uniqueness if it's changing and is not None
        if val is not None and val != product.sku:
            existing = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.sku == val).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product with SKU/code '{val}' already exists."
                )
            
    for key, value in update_data.items():
        setattr(product, key, value)
        
    try:
        db.commit()
        db.refresh(product)
        return product
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error during product update."
        )

@app.delete("/products/{product_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    product = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id:int} not found."
        )
    
    db.delete(product)
    db.commit()
    return None


# ── CUSTOMERS ENDPOINTS (existing) ─────────────────────────────────────────────

@app.post("/customers", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Check email uniqueness
    db_customer = db.query(models.Customer).filter(models.Customer.owner_id == current_user.id).filter(models.Customer.email == customer.email).first()
    if db_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Customer with email '{customer.email}' already exists."
        )
        
    new_customer = models.Customer(owner_id=current_user.id, **customer.model_dump())
    db.add(new_customer)
    try:
        db.commit()
        db.refresh(new_customer)
        return new_customer
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error during customer creation."
        )

@app.get("/customers", response_model=List[schemas.CustomerResponse])
def get_customers(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Customer).filter(models.Customer.owner_id == current_user.id).all()

@app.get("/customers/{customer_id:int}", response_model=schemas.CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    customer = db.query(models.Customer).filter(models.Customer.owner_id == current_user.id).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id:int} not found."
        )
    return customer

@app.delete("/customers/{customer_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    customer = db.query(models.Customer).filter(models.Customer.owner_id == current_user.id).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id:int} not found."
        )
    
    db.delete(customer)
    db.commit()
    return None


# ── ORDERS ENDPOINTS (existing) ────────────────────────────────────────────────

@app.post("/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # 1. Verify customer exists
    customer = db.query(models.Customer).filter(models.Customer.owner_id == current_user.id).filter(models.Customer.id == order_data.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Customer with ID {order_data.customer_id} does not exist."
        )
        
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An order must contain at least one item."
        )

    # Use strict Decimal math to avoid float precision issues
    total_amount = Decimal("0.0")
    order_items_to_create = []
    
    # Deducting products requires a locked write block
    try:
        # 2. Lock product rows and check stock to prevent race conditions in concurrent orders
        for item in order_data.items:
            product = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.id == item.product_id).with_for_update().first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product with ID {item.product_id} does not exist."
                )
                
            if product.quantity < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for product '{product.name}' (SKU: {product.sku}). Available: {product.quantity}, Requested: {item.quantity}."
                )
                
            # Calculate item total
            item_total = product.price * item.quantity
            total_amount += item_total
            
            # Deduct stock
            product.quantity -= item.quantity
            
            # Create OrderItem object
            order_item = models.OrderItem(owner_id=current_user.id, 
                product_id=product.id,
                quantity=item.quantity,
                price_at_order=product.price
            )
            order_items_to_create.append(order_item)

        # 3. Create the parent Order record
        db_order = models.Order(owner_id=current_user.id, 
            customer_id=customer.id,
            total_amount=total_amount
        )
        db.add(db_order)
        db.flush() # Populate the order ID

        # Link order items and save
        for item in order_items_to_create:
            item.order_id = db_order.id
            db.add(item)
            
        db.commit()
        db.refresh(db_order)
        
        # Serialize response payload with customer & product name detail annotations
        response_order = schemas.OrderResponse.model_validate(db_order)
        response_order.customer_name = customer.name
        
        for item_resp in response_order.items:
            product_name = db.query(models.Product.name).filter(models.Product.owner_id == current_user.id).filter(models.Product.id == item_resp.product_id).scalar()
            item_resp.product_name = product_name or "Unknown Product"
            
        return response_order
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error placing order: {str(e)}"
        )

@app.get("/orders", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    orders = db.query(models.Order).filter(models.Order.owner_id == current_user.id).all()
    response_orders = []
    
    for order in orders:
        c_name = db.query(models.Customer.name).filter(models.Customer.owner_id == current_user.id).filter(models.Customer.id == order.customer_id).scalar()
        resp = schemas.OrderResponse.model_validate(order)
        resp.customer_name = c_name or "Unknown Customer"
        
        for item in resp.items:
            p_name = db.query(models.Product.name).filter(models.Product.owner_id == current_user.id).filter(models.Product.id == item.product_id).scalar()
            item.product_name = p_name or "Unknown Product"
            
        response_orders.append(resp)
        
    return response_orders

@app.get("/orders/{order_id:int}", response_model=schemas.OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.owner_id == current_user.id).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id:int} not found."
        )
        
    c_name = db.query(models.Customer.name).filter(models.Customer.owner_id == current_user.id).filter(models.Customer.id == order.customer_id).scalar()
    resp = schemas.OrderResponse.model_validate(order)
    resp.customer_name = c_name or "Unknown Customer"
    
    for item in resp.items:
        p_name = db.query(models.Product.name).filter(models.Product.owner_id == current_user.id).filter(models.Product.id == item.product_id).scalar()
        item.product_name = p_name or "Unknown Product"
        
    return resp

@app.delete("/orders/{order_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.owner_id == current_user.id).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id:int} not found."
        )
        
    # Restock products inside transactional block
    try:
        for item in order.items:
            # Lock the product row during restocking
            product = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.id == item.product_id).with_for_update().first()
            if product:
                product.quantity += item.quantity
                
        db.delete(order)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error canceling order: {str(e)}"
        )
    return None


# ── DASHBOARD SUMMARY ENDPOINT (existing) ──────────────────────────────────────

@app.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    total_products = db.query(models.Product).filter(models.Product.owner_id == current_user.id).count()
    total_customers = db.query(models.Customer).filter(models.Customer.owner_id == current_user.id).count()
    total_orders = db.query(models.Order).filter(models.Order.owner_id == current_user.id).count()
    
    # Low stock: quantity <= 10
    low_stock_products = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.quantity <= 10).all()
    
    # Map products for summary display
    low_stock_list = []
    for p in low_stock_products:
        low_stock_list.append({
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "price": float(p.price),
            "quantity": p.quantity
        })
        
    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": low_stock_list
    }


# ── DASHBOARD ANALYTICS ENDPOINT (existing) ────────────────────────────────────

@app.get("/dashboard/analytics")
def get_dashboard_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    from sqlalchemy import func

    # 1. Sales over time
    sales_query = db.query(
        func.date(models.Order.created_at).label("date"),
        func.sum(models.Order.total_amount).label("revenue"),
        func.count(models.Order.id).label("orders_count")
    ).filter(models.Order.owner_id == current_user.id)\
     .group_by(func.date(models.Order.created_at))\
     .order_by(func.date(models.Order.created_at)).all()
    
    sales_over_time = []
    for row in sales_query:
        sales_over_time.append({
            "date": str(row.date),
            "revenue": float(row.revenue or 0),
            "orders": row.orders_count
        })

    # 2. Top selling products
    top_products_query = db.query(
        models.Product.name,
        func.sum(models.OrderItem.quantity).label("units_sold"),
        func.sum(models.OrderItem.quantity * models.OrderItem.price_at_order).label("revenue")
    ).join(models.OrderItem, models.Product.id == models.OrderItem.product_id)\
     .filter(models.Product.owner_id == current_user.id)\
     .group_by(models.Product.id)\
     .order_by(func.sum(models.OrderItem.quantity).desc())\
     .limit(5).all()
     
    top_products = []
    for row in top_products_query:
        top_products.append({
            "name": row.name,
            "units_sold": int(row.units_sold or 0),
            "revenue": float(row.revenue or 0)
        })

    # 3. Stock status distribution
    in_stock_count = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.quantity > 10).count()
    low_stock_count = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.quantity > 0, models.Product.quantity <= 10).count()
    out_of_stock_count = db.query(models.Product).filter(models.Product.owner_id == current_user.id).filter(models.Product.quantity == 0).count()
    
    stock_distribution = [
        {"name": "In Stock (>10)", "value": in_stock_count},
        {"name": "Low Stock (1-10)", "value": low_stock_count},
        {"name": "Out of Stock", "value": out_of_stock_count}
    ]

    # 4. Top customers by value
    top_customers_query = db.query(
        models.Customer.name,
        func.count(models.Order.id).label("orders_count"),
        func.sum(models.Order.total_amount).label("total_spent")
    ).join(models.Order, models.Customer.id == models.Order.customer_id)\
     .filter(models.Customer.owner_id == current_user.id)\
     .group_by(models.Customer.id)\
     .order_by(func.sum(models.Order.total_amount).desc())\
     .limit(5).all()
     
    top_customers = []
    for row in top_customers_query:
        top_customers.append({
            "name": row.name,
            "orders_count": row.orders_count,
            "total_spent": float(row.total_spent or 0)
        })

    return {
        "sales_over_time": sales_over_time,
        "top_products": top_products,
        "stock_distribution": stock_distribution,
        "top_customers": top_customers
    }


# ── SETUP: CATEGORIES ──────────────────────────────────────────────────────────

@app.get("/setup/categories", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Category).filter(models.Category.owner_id == current_user.id).all()

@app.post("/setup/categories", response_model=schemas.CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_cat = models.Category(owner_id=current_user.id, **category.model_dump())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@app.delete("/setup/categories/{category_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    cat = db.query(models.Category).filter(models.Category.owner_id == current_user.id).filter(models.Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found.")
    db.delete(cat)
    db.commit()
    return None


# ── SETUP: COMPANIES ───────────────────────────────────────────────────────────

@app.get("/setup/companies", response_model=List[schemas.CompanyResponse])
def get_companies(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Company).filter(models.Company.owner_id == current_user.id).all()

@app.post("/setup/companies", response_model=schemas.CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_co = models.Company(owner_id=current_user.id, **company.model_dump())
    db.add(new_co)
    db.commit()
    db.refresh(new_co)
    return new_co

@app.delete("/setup/companies/{company_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    co = db.query(models.Company).filter(models.Company.owner_id == current_user.id).filter(models.Company.id == company_id).first()
    if not co:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found.")
    db.delete(co)
    db.commit()
    return None


# ── SETUP: UNIT TYPES ──────────────────────────────────────────────────────────

@app.get("/setup/unitTypes", response_model=List[schemas.UnitTypeResponse])
def get_unit_types(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.UnitType).filter(models.UnitType.owner_id == current_user.id).all()

@app.post("/setup/unitTypes", response_model=schemas.UnitTypeResponse, status_code=status.HTTP_201_CREATED)
def create_unit_type(unit_type: schemas.UnitTypeCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_ut = models.UnitType(owner_id=current_user.id, **unit_type.model_dump())
    db.add(new_ut)
    db.commit()
    db.refresh(new_ut)
    return new_ut

@app.delete("/setup/unitTypes/{unit_type_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_unit_type(unit_type_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    ut = db.query(models.UnitType).filter(models.UnitType.owner_id == current_user.id).filter(models.UnitType.id == unit_type_id).first()
    if not ut:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unit type not found.")
    db.delete(ut)
    db.commit()
    return None


# ── SUPPLIERS: LIST ────────────────────────────────────────────────────────────

@app.get("/suppliers/lists", response_model=List[schemas.SupplierResponse])
def get_suppliers(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Supplier).filter(models.Supplier.owner_id == current_user.id).all()

@app.post("/suppliers/lists", response_model=schemas.SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_sup = models.Supplier(owner_id=current_user.id, **supplier.model_dump())
    db.add(new_sup)
    db.commit()
    db.refresh(new_sup)
    return new_sup

@app.delete("/suppliers/lists/{supplier_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(supplier_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    sup = db.query(models.Supplier).filter(models.Supplier.owner_id == current_user.id).filter(models.Supplier.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found.")
    db.delete(sup)
    db.commit()
    return None


# ── SUPPLIERS: DOCUMENTS ───────────────────────────────────────────────────────

@app.get("/suppliers/documents", response_model=List[schemas.SupplierDocumentResponse])
def get_supplier_documents(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.SupplierDocument).filter(models.SupplierDocument.owner_id == current_user.id).all()

@app.post("/suppliers/documents", response_model=schemas.SupplierDocumentResponse, status_code=status.HTTP_201_CREATED)
def create_supplier_document(doc: schemas.SupplierDocumentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_doc = models.SupplierDocument(owner_id=current_user.id, **doc.model_dump())
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@app.delete("/suppliers/documents/{doc_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier_document(doc_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    doc = db.query(models.SupplierDocument).filter(models.SupplierDocument.owner_id == current_user.id).filter(models.SupplierDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    db.delete(doc)
    db.commit()
    return None


# ── SUPPLIERS: PAYMENTS ────────────────────────────────────────────────────────

@app.get("/suppliers/payments", response_model=List[schemas.SupplierPaymentResponse])
def get_supplier_payments(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.SupplierPayment).filter(models.SupplierPayment.owner_id == current_user.id).all()

@app.post("/suppliers/payments", response_model=schemas.SupplierPaymentResponse, status_code=status.HTTP_201_CREATED)
def create_supplier_payment(payment: schemas.SupplierPaymentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_pay = models.SupplierPayment(owner_id=current_user.id, **payment.model_dump())
    db.add(new_pay)
    db.commit()
    db.refresh(new_pay)
    return new_pay

@app.delete("/suppliers/payments/{payment_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier_payment(payment_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    pay = db.query(models.SupplierPayment).filter(models.SupplierPayment.owner_id == current_user.id).filter(models.SupplierPayment.id == payment_id).first()
    if not pay:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found.")
    db.delete(pay)
    db.commit()
    return None


# ── PHARMACY PRODUCTS (main stock) ─────────────────────────────────────────────

@app.get("/products/main", response_model=List[schemas.PharmacyProductResponse])
def get_pharmacy_products(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.PharmacyProduct).filter(models.PharmacyProduct.owner_id == current_user.id).all()

@app.post("/products/main", response_model=schemas.PharmacyProductResponse, status_code=status.HTTP_201_CREATED)
def create_pharmacy_product(product: schemas.PharmacyProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_prod = models.PharmacyProduct(owner_id=current_user.id, **product.model_dump())
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return new_prod

@app.delete("/products/main/{product_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pharmacy_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    prod = db.query(models.PharmacyProduct).filter(models.PharmacyProduct.owner_id == current_user.id).filter(models.PharmacyProduct.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pharmacy product not found.")
    db.delete(prod)
    db.commit()
    return None


# ── NON-PHARMACY PRODUCTS (supplies stock) ─────────────────────────────────────

@app.get("/products/supplies", response_model=List[schemas.PharmacyProductResponse])
def get_non_pharmacy_products(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.NonPharmacyProduct).filter(models.NonPharmacyProduct.owner_id == current_user.id).all()

@app.post("/products/supplies", response_model=schemas.PharmacyProductResponse, status_code=status.HTTP_201_CREATED)
def create_non_pharmacy_product(product: schemas.PharmacyProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_prod = models.NonPharmacyProduct(owner_id=current_user.id, **product.model_dump())
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return new_prod

@app.delete("/products/supplies/{product_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_non_pharmacy_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    prod = db.query(models.NonPharmacyProduct).filter(models.NonPharmacyProduct.owner_id == current_user.id).filter(models.NonPharmacyProduct.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Non-pharmacy product not found.")
    db.delete(prod)
    db.commit()
    return None


# ── PURCHASES: PHARMACY (main) ─────────────────────────────────────────────────

@app.get("/purchases/main", response_model=List[schemas.PurchaseResponse])
def get_pharmacy_purchases(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Purchase).filter(models.Purchase.owner_id == current_user.id).filter(models.Purchase.product_type == "main").all()

@app.post("/purchases/main", response_model=schemas.PurchaseResponse, status_code=status.HTTP_201_CREATED)
def create_pharmacy_purchase(purchase: schemas.PurchaseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    data = purchase.model_dump()
    data["product_type"] = "main"
    new_purchase = models.Purchase(owner_id=current_user.id, **data)
    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)
    return new_purchase

@app.delete("/purchases/main/{purchase_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pharmacy_purchase(purchase_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    p = db.query(models.Purchase).filter(models.Purchase.owner_id == current_user.id).filter(models.Purchase.id == purchase_id, models.Purchase.product_type == "main").first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Purchase not found.")
    db.delete(p)
    db.commit()
    return None


# ── PURCHASES: NON-PHARMACY (supplies) ────────────────────────────────────────

@app.get("/purchases/supplies", response_model=List[schemas.PurchaseResponse])
def get_non_pharmacy_purchases(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Purchase).filter(models.Purchase.owner_id == current_user.id).filter(models.Purchase.product_type == "supplies").all()

@app.post("/purchases/supplies", response_model=schemas.PurchaseResponse, status_code=status.HTTP_201_CREATED)
def create_non_pharmacy_purchase(purchase: schemas.PurchaseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    data = purchase.model_dump()
    data["product_type"] = "supplies"
    new_purchase = models.Purchase(owner_id=current_user.id, **data)
    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)
    return new_purchase

@app.delete("/purchases/supplies/{purchase_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_non_pharmacy_purchase(purchase_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    p = db.query(models.Purchase).filter(models.Purchase.owner_id == current_user.id).filter(models.Purchase.id == purchase_id, models.Purchase.product_type == "supplies").first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Purchase not found.")
    db.delete(p)
    db.commit()
    return None


# ── RETURNS: CUSTOMERS ─────────────────────────────────────────────────────────

@app.get("/returns/customers", response_model=List[schemas.ReturnResponse])
def get_customer_returns(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Return).filter(models.Return.owner_id == current_user.id).filter(models.Return.return_type == "customers").all()

@app.post("/returns/customers", response_model=schemas.ReturnResponse, status_code=status.HTTP_201_CREATED)
def create_customer_return(ret: schemas.ReturnCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    data = ret.model_dump()
    data["return_type"] = "customers"
    new_ret = models.Return(owner_id=current_user.id, **data)
    db.add(new_ret)
    db.commit()
    db.refresh(new_ret)
    return new_ret

@app.delete("/returns/customers/{return_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer_return(return_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    r = db.query(models.Return).filter(models.Return.owner_id == current_user.id).filter(models.Return.id == return_id, models.Return.return_type == "customers").first()
    if not r:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Return not found.")
    db.delete(r)
    db.commit()
    return None


# ── RETURNS: EXPIRES OR DAMAGES ────────────────────────────────────────────────

@app.get("/returns/expiresOrDamages", response_model=List[schemas.ReturnResponse])
def get_expires_damages_returns(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Return).filter(models.Return.owner_id == current_user.id).filter(models.Return.return_type == "expiresOrDamages").all()

@app.post("/returns/expiresOrDamages", response_model=schemas.ReturnResponse, status_code=status.HTTP_201_CREATED)
def create_expires_damages_return(ret: schemas.ReturnCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    data = ret.model_dump()
    data["return_type"] = "expiresOrDamages"
    new_ret = models.Return(owner_id=current_user.id, **data)
    db.add(new_ret)
    db.commit()
    db.refresh(new_ret)
    return new_ret

@app.delete("/returns/expiresOrDamages/{return_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expires_damages_return(return_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    r = db.query(models.Return).filter(models.Return.owner_id == current_user.id).filter(models.Return.id == return_id, models.Return.return_type == "expiresOrDamages").first()
    if not r:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Return not found.")
    db.delete(r)
    db.commit()
    return None


# ── REQUESTED ITEMS: PHARMACY (main) ───────────────────────────────────────────

@app.get("/requestedItems/main", response_model=List[schemas.RequestedItemResponse])
def get_pharmacy_requested_items(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.RequestedItem).filter(models.RequestedItem.owner_id == current_user.id).filter(models.RequestedItem.item_type == "main").all()

@app.post("/requestedItems/main", response_model=schemas.RequestedItemResponse, status_code=status.HTTP_201_CREATED)
def create_pharmacy_requested_item(item: schemas.RequestedItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    data = item.model_dump()
    data["item_type"] = "main"
    new_item = models.RequestedItem(owner_id=current_user.id, **data)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.delete("/requestedItems/main/{item_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pharmacy_requested_item(item_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    it = db.query(models.RequestedItem).filter(models.RequestedItem.owner_id == current_user.id).filter(models.RequestedItem.id == item_id, models.RequestedItem.item_type == "main").first()
    if not it:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requested item not found.")
    db.delete(it)
    db.commit()
    return None


# ── REQUESTED ITEMS: NON-PHARMACY (supplies) ───────────────────────────────────

@app.get("/requestedItems/supplies", response_model=List[schemas.RequestedItemResponse])
def get_non_pharmacy_requested_items(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.RequestedItem).filter(models.RequestedItem.owner_id == current_user.id).filter(models.RequestedItem.item_type == "supplies").all()

@app.post("/requestedItems/supplies", response_model=schemas.RequestedItemResponse, status_code=status.HTTP_201_CREATED)
def create_non_pharmacy_requested_item(item: schemas.RequestedItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    data = item.model_dump()
    data["item_type"] = "supplies"
    new_item = models.RequestedItem(owner_id=current_user.id, **data)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.delete("/requestedItems/supplies/{item_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_non_pharmacy_requested_item(item_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    it = db.query(models.RequestedItem).filter(models.RequestedItem.owner_id == current_user.id).filter(models.RequestedItem.id == item_id, models.RequestedItem.item_type == "supplies").first()
    if not it:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requested item not found.")
    db.delete(it)
    db.commit()
    return None


# ── EMPLOYEES ──────────────────────────────────────────────────────────────────

@app.get("/employees", response_model=List[schemas.EmployeeResponse])
def get_employees(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Employee).filter(models.Employee.owner_id == current_user.id).all()

@app.post("/employees", response_model=schemas.EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_emp = models.Employee(owner_id=current_user.id, **employee.model_dump())
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@app.delete("/employees/{employee_id:int}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    emp = db.query(models.Employee).filter(models.Employee.owner_id == current_user.id).filter(models.Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")
    db.delete(emp)
    db.commit()
    return None
