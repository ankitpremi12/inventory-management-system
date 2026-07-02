from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, CheckConstraint, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


# ── Existing core models ─────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Integer, default=1)
    reset_token = Column(String(255), nullable=True)
    reset_token_expiry = Column(DateTime(timezone=True), nullable=True)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), index=True, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, default=0, nullable=False)

    __table_args__ = (
        CheckConstraint("quantity >= 0", name="check_quantity_non_negative"),
    )

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=False)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    customer = relationship("Customer")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_order = Column(Numeric(10, 2), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

    __table_args__ = (
        CheckConstraint("quantity > 0", name="check_quantity_positive"),
    )


# ── Setup / Reference Data Models ────────────────────────────────────────────

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedTime = Column(DateTime(timezone=True), server_default=func.now())
    updatedBy = Column(String(100), nullable=True)
    updatedTime = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedTime = Column(DateTime(timezone=True), server_default=func.now())
    updatedBy = Column(String(100), nullable=True)
    updatedTime = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)


class UnitType(Base):
    __tablename__ = "unit_types"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedTime = Column(DateTime(timezone=True), server_default=func.now())
    updatedBy = Column(String(100), nullable=True)
    updatedTime = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)


# ── Suppliers ────────────────────────────────────────────────────────────────

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedTime = Column(DateTime(timezone=True), server_default=func.now())
    updatedBy = Column(String(100), nullable=True)
    updatedTime = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    documents = relationship("SupplierDocument", back_populates="supplier", cascade="all, delete-orphan")
    payments = relationship("SupplierPayment", back_populates="supplier", cascade="all, delete-orphan")


class SupplierDocument(Base):
    __tablename__ = "supplier_documents"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=True)
    documentName = Column(String(255), nullable=True)
    documentType = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedTime = Column(DateTime(timezone=True), server_default=func.now())
    updatedBy = Column(String(100), nullable=True)
    updatedTime = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    supplier = relationship("Supplier", back_populates="documents")


class SupplierPayment(Base):
    __tablename__ = "supplier_payments"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=True)
    due = Column(Numeric(12, 2), nullable=True, default=0)
    paid = Column(Numeric(12, 2), nullable=True, default=0)
    total = Column(Numeric(12, 2), nullable=True, default=0)
    receivable_due = Column(Numeric(12, 2), nullable=True, default=0)
    received = Column(Numeric(12, 2), nullable=True, default=0)
    addedBy = Column(String(100), nullable=True)
    addedTime = Column(DateTime(timezone=True), server_default=func.now())
    updatedBy = Column(String(100), nullable=True)
    updatedTime = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    supplier = relationship("Supplier", back_populates="payments")


# ── Pharmacy / Non-Pharmacy Products ─────────────────────────────────────────

class PharmacyProduct(Base):
    """Main stock — pharmacy (medicines) products."""
    __tablename__ = "pharmacy_products"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tradeName = Column(String(255), nullable=False)
    genericName = Column(String(255), nullable=True)
    strength = Column(String(100), nullable=True)
    category = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    stock = Column(Integer, default=0, nullable=False)
    packType = Column(String(50), nullable=True, default="Box")
    purchaseUnitType = Column(String(100), nullable=True)
    purchasePackSize = Column(String(100), nullable=True)
    packTp = Column(Numeric(12, 4), nullable=True)
    unitTp = Column(Numeric(12, 4), nullable=True)
    purchaseVatPercent = Column(Numeric(8, 2), nullable=True)
    purchaseVatTaka = Column(Numeric(12, 4), nullable=True)
    purchaseDiscountPercent = Column(Numeric(8, 2), nullable=True)
    purchaseDiscountTaka = Column(Numeric(12, 4), nullable=True)
    salesUnitType = Column(String(100), nullable=True)
    salePackSize = Column(String(100), nullable=True)
    packMrp = Column(Numeric(12, 4), nullable=True)
    unitMrp = Column(Numeric(12, 4), nullable=True)
    salesVatPercent = Column(Numeric(8, 2), nullable=True)
    salesVatTaka = Column(Numeric(12, 4), nullable=True)
    salesDiscountPercent = Column(Numeric(8, 2), nullable=True)
    salesDiscountTaka = Column(Numeric(12, 4), nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedToDbAt = Column(DateTime(timezone=True), server_default=func.now())


class NonPharmacyProduct(Base):
    """Supplies stock — non-pharmacy products."""
    __tablename__ = "non_pharmacy_products"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tradeName = Column(String(255), nullable=False)
    genericName = Column(String(255), nullable=True)
    strength = Column(String(100), nullable=True)
    category = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    stock = Column(Integer, default=0, nullable=False)
    packType = Column(String(50), nullable=True, default="Box")
    purchaseUnitType = Column(String(100), nullable=True)
    purchasePackSize = Column(String(100), nullable=True)
    packTp = Column(Numeric(12, 4), nullable=True)
    unitTp = Column(Numeric(12, 4), nullable=True)
    purchaseVatPercent = Column(Numeric(8, 2), nullable=True)
    purchaseVatTaka = Column(Numeric(12, 4), nullable=True)
    purchaseDiscountPercent = Column(Numeric(8, 2), nullable=True)
    purchaseDiscountTaka = Column(Numeric(12, 4), nullable=True)
    salesUnitType = Column(String(100), nullable=True)
    salePackSize = Column(String(100), nullable=True)
    packMrp = Column(Numeric(12, 4), nullable=True)
    unitMrp = Column(Numeric(12, 4), nullable=True)
    salesVatPercent = Column(Numeric(8, 2), nullable=True)
    salesVatTaka = Column(Numeric(12, 4), nullable=True)
    salesDiscountPercent = Column(Numeric(8, 2), nullable=True)
    salesDiscountTaka = Column(Numeric(12, 4), nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedToDbAt = Column(DateTime(timezone=True), server_default=func.now())


# ── Purchases ─────────────────────────────────────────────────────────────────

class Purchase(Base):
    """Purchase records for pharmacy (main) products."""
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_type = Column(String(20), nullable=False, default="main")  # 'main' | 'supplies'
    supplier = Column(String(255), nullable=True)
    tradeName = Column(String(255), nullable=True)
    category = Column(String(255), nullable=True)
    strength = Column(String(100), nullable=True)
    boxType = Column(String(100), nullable=True)
    unitType = Column(String(100), nullable=True)
    creator = Column(String(100), nullable=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())


# ── Returns ───────────────────────────────────────────────────────────────────

class Return(Base):
    """Return records — customer returns and expires/damages."""
    __tablename__ = "returns"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    return_type = Column(String(30), nullable=False, default="customers")  # 'customers' | 'expiresOrDamages'
    tradeName = Column(String(255), nullable=True)
    genericName = Column(String(255), nullable=True)
    strength = Column(String(100), nullable=True)
    category = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    stock = Column(Integer, nullable=True, default=0)
    packType = Column(String(50), nullable=True)
    purchaseUnitType = Column(String(100), nullable=True)
    purchasePackSize = Column(String(100), nullable=True)
    packTp = Column(Numeric(12, 4), nullable=True)
    unitTp = Column(Numeric(12, 4), nullable=True)
    purchaseVatPercent = Column(Numeric(8, 2), nullable=True)
    purchaseVatTaka = Column(Numeric(12, 4), nullable=True)
    purchaseDiscountPercent = Column(Numeric(8, 2), nullable=True)
    purchaseDiscountTaka = Column(Numeric(12, 4), nullable=True)
    salesUnitType = Column(String(100), nullable=True)
    salePackSize = Column(String(100), nullable=True)
    packMrp = Column(Numeric(12, 4), nullable=True)
    unitMrp = Column(Numeric(12, 4), nullable=True)
    salesVatPercent = Column(Numeric(8, 2), nullable=True)
    salesVatTaka = Column(Numeric(12, 4), nullable=True)
    salesDiscountPercent = Column(Numeric(8, 2), nullable=True)
    salesDiscountTaka = Column(Numeric(12, 4), nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedToDbAt = Column(DateTime(timezone=True), server_default=func.now())


# ── Requested Items ───────────────────────────────────────────────────────────

class RequestedItem(Base):
    """Items requested for restocking."""
    __tablename__ = "requested_items"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    item_type = Column(String(20), nullable=False, default="main")  # 'main' | 'supplies'
    tradeName = Column(String(255), nullable=True)
    genericName = Column(String(255), nullable=True)
    strength = Column(String(100), nullable=True)
    category = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    stock = Column(Integer, nullable=True, default=0)
    packType = Column(String(50), nullable=True)
    purchaseUnitType = Column(String(100), nullable=True)
    purchasePackSize = Column(String(100), nullable=True)
    packTp = Column(Numeric(12, 4), nullable=True)
    unitTp = Column(Numeric(12, 4), nullable=True)
    purchaseVatPercent = Column(Numeric(8, 2), nullable=True)
    purchaseVatTaka = Column(Numeric(12, 4), nullable=True)
    purchaseDiscountPercent = Column(Numeric(8, 2), nullable=True)
    purchaseDiscountTaka = Column(Numeric(12, 4), nullable=True)
    salesUnitType = Column(String(100), nullable=True)
    salePackSize = Column(String(100), nullable=True)
    packMrp = Column(Numeric(12, 4), nullable=True)
    unitMrp = Column(Numeric(12, 4), nullable=True)
    salesVatPercent = Column(Numeric(8, 2), nullable=True)
    salesVatTaka = Column(Numeric(12, 4), nullable=True)
    salesDiscountPercent = Column(Numeric(8, 2), nullable=True)
    salesDiscountTaka = Column(Numeric(12, 4), nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedToDbAt = Column(DateTime(timezone=True), server_default=func.now())


# ── Employees ─────────────────────────────────────────────────────────────────

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    addedBy = Column(String(100), nullable=True)
    addedTime = Column(DateTime(timezone=True), server_default=func.now())
    updatedBy = Column(String(100), nullable=True)
    updatedTime = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
