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
    description="Backend API for managing products, customers, and orders with automated inventory tracking",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTH ENDPOINTS ---

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


# --- PRODUCTS ENDPOINTS ---

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
        db_product = db.query(models.Product).filter(models.Product.sku == product.sku).first()
        if db_product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with SKU/code '{product.sku}' already exists."
            )
    
    new_product = models.Product(**product.model_dump())
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
    return db.query(models.Product).all()

@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
        )
    return product

@app.put("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: int, product_update: schemas.ProductUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
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
            existing = db.query(models.Product).filter(models.Product.sku == val).first()
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

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found."
        )
    
    db.delete(product)
    db.commit()
    return None


# --- CUSTOMERS ENDPOINTS ---

@app.post("/customers", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Check email uniqueness
    db_customer = db.query(models.Customer).filter(models.Customer.email == customer.email).first()
    if db_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Customer with email '{customer.email}' already exists."
        )
        
    new_customer = models.Customer(**customer.model_dump())
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
    return db.query(models.Customer).all()

@app.get("/customers/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found."
        )
    return customer

@app.delete("/customers/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found."
        )
    
    db.delete(customer)
    db.commit()
    return None


# --- ORDERS ENDPOINTS ---

@app.post("/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # 1. Verify customer exists
    customer = db.query(models.Customer).filter(models.Customer.id == order_data.customer_id).first()
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
            product = db.query(models.Product).filter(models.Product.id == item.product_id).with_for_update().first()
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
            order_item = models.OrderItem(
                product_id=product.id,
                quantity=item.quantity,
                price_at_order=product.price
            )
            order_items_to_create.append(order_item)

        # 3. Create the parent Order record
        db_order = models.Order(
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
            product_name = db.query(models.Product.name).filter(models.Product.id == item_resp.product_id).scalar()
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
    orders = db.query(models.Order).all()
    response_orders = []
    
    for order in orders:
        c_name = db.query(models.Customer.name).filter(models.Customer.id == order.customer_id).scalar()
        resp = schemas.OrderResponse.model_validate(order)
        resp.customer_name = c_name or "Unknown Customer"
        
        for item in resp.items:
            p_name = db.query(models.Product.name).filter(models.Product.id == item.product_id).scalar()
            item.product_name = p_name or "Unknown Product"
            
        response_orders.append(resp)
        
    return response_orders

@app.get("/orders/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found."
        )
        
    c_name = db.query(models.Customer.name).filter(models.Customer.id == order.customer_id).scalar()
    resp = schemas.OrderResponse.model_validate(order)
    resp.customer_name = c_name or "Unknown Customer"
    
    for item in resp.items:
        p_name = db.query(models.Product.name).filter(models.Product.id == item.product_id).scalar()
        item.product_name = p_name or "Unknown Product"
        
    return resp

@app.delete("/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found."
        )
        
    # Restock products inside transactional block
    try:
        for item in order.items:
            # Lock the product row during restocking
            product = db.query(models.Product).filter(models.Product.id == item.product_id).with_for_update().first()
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

# --- DASHBOARD SUMMARY ENDPOINT ---
@app.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    total_products = db.query(models.Product).count()
    total_customers = db.query(models.Customer).count()
    total_orders = db.query(models.Order).count()
    
    # Low stock: quantity <= 10
    low_stock_products = db.query(models.Product).filter(models.Product.quantity <= 10).all()
    
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

# --- DASHBOARD ANALYTICS ENDPOINT ---
@app.get("/dashboard/analytics")
def get_dashboard_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    from sqlalchemy import func

    # 1. Sales over time
    sales_query = db.query(
        func.date(models.Order.created_at).label("date"),
        func.sum(models.Order.total_amount).label("revenue"),
        func.count(models.Order.id).label("orders_count")
    ).group_by(func.date(models.Order.created_at)).order_by(func.date(models.Order.created_at)).all()
    
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
    in_stock_count = db.query(models.Product).filter(models.Product.quantity > 10).count()
    low_stock_count = db.query(models.Product).filter(models.Product.quantity > 0, models.Product.quantity <= 10).count()
    out_of_stock_count = db.query(models.Product).filter(models.Product.quantity == 0).count()
    
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
