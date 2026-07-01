from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

# ── AUTH SCHEMAS ─────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)


# ── PRODUCT SCHEMAS (existing) ────────────────────────────────────────────────

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    sku: Optional[str] = Field(None, max_length=100)
    price: Decimal = Field(..., gt=0)
    quantity: int = Field(..., ge=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    sku: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[Decimal] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True


# ── CUSTOMER SCHEMAS (existing) ───────────────────────────────────────────────

class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=3, max_length=255)
    phone: str = Field(..., min_length=1, max_length=50)

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int

    class Config:
        from_attributes = True


# ── ORDER SCHEMAS (existing) ──────────────────────────────────────────────────

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    quantity: int
    price_at_order: Decimal

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    customer_name: Optional[str] = None
    total_amount: Decimal
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


# ── SETUP SCHEMAS ─────────────────────────────────────────────────────────────

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

    class Config:
        from_attributes = True


class CompanyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

class CompanyResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

    class Config:
        from_attributes = True


class UnitTypeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

class UnitTypeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── SUPPLIER SCHEMAS ──────────────────────────────────────────────────────────

class SupplierCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

class SupplierResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

    class Config:
        from_attributes = True


class SupplierDocumentCreate(BaseModel):
    supplier_id: Optional[int] = None
    documentName: Optional[str] = None
    documentType: Optional[str] = None
    notes: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

class SupplierDocumentResponse(BaseModel):
    id: int
    supplier_id: Optional[int] = None
    documentName: Optional[str] = None
    documentType: Optional[str] = None
    notes: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

    class Config:
        from_attributes = True


class SupplierPaymentCreate(BaseModel):
    supplier_id: Optional[int] = None
    due: Optional[Decimal] = None
    paid: Optional[Decimal] = None
    total: Optional[Decimal] = None
    receivable_due: Optional[Decimal] = None
    received: Optional[Decimal] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

class SupplierPaymentResponse(BaseModel):
    id: int
    supplier_id: Optional[int] = None
    due: Optional[Decimal] = None
    paid: Optional[Decimal] = None
    total: Optional[Decimal] = None
    receivable_due: Optional[Decimal] = None
    received: Optional[Decimal] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── PHARMACY / NON-PHARMACY PRODUCT SCHEMAS ───────────────────────────────────

class PharmacyProductCreate(BaseModel):
    tradeName: str = Field(..., min_length=1, max_length=255)
    genericName: Optional[str] = None
    strength: Optional[str] = None
    category: Optional[str] = None
    company: Optional[str] = None
    stock: Optional[int] = 0
    packType: Optional[str] = "Box"
    purchaseUnitType: Optional[str] = None
    purchasePackSize: Optional[str] = None
    packTp: Optional[Decimal] = None
    unitTp: Optional[Decimal] = None
    purchaseVatPercent: Optional[Decimal] = None
    purchaseVatTaka: Optional[Decimal] = None
    purchaseDiscountPercent: Optional[Decimal] = None
    purchaseDiscountTaka: Optional[Decimal] = None
    salesUnitType: Optional[str] = None
    salePackSize: Optional[str] = None
    packMrp: Optional[Decimal] = None
    unitMrp: Optional[Decimal] = None
    salesVatPercent: Optional[Decimal] = None
    salesVatTaka: Optional[Decimal] = None
    salesDiscountPercent: Optional[Decimal] = None
    salesDiscountTaka: Optional[Decimal] = None
    addedBy: Optional[str] = None
    addedToDbAt: Optional[datetime] = None

class PharmacyProductResponse(BaseModel):
    id: int
    tradeName: str
    genericName: Optional[str] = None
    strength: Optional[str] = None
    category: Optional[str] = None
    company: Optional[str] = None
    stock: Optional[int] = 0
    packType: Optional[str] = None
    purchaseUnitType: Optional[str] = None
    purchasePackSize: Optional[str] = None
    packTp: Optional[Decimal] = None
    unitTp: Optional[Decimal] = None
    purchaseVatPercent: Optional[Decimal] = None
    purchaseVatTaka: Optional[Decimal] = None
    purchaseDiscountPercent: Optional[Decimal] = None
    purchaseDiscountTaka: Optional[Decimal] = None
    salesUnitType: Optional[str] = None
    salePackSize: Optional[str] = None
    packMrp: Optional[Decimal] = None
    unitMrp: Optional[Decimal] = None
    salesVatPercent: Optional[Decimal] = None
    salesVatTaka: Optional[Decimal] = None
    salesDiscountPercent: Optional[Decimal] = None
    salesDiscountTaka: Optional[Decimal] = None
    addedBy: Optional[str] = None
    addedToDbAt: Optional[datetime] = None

    class Config:
        from_attributes = True

# NonPharmacyProduct uses identical fields
NonPharmacyProductCreate = PharmacyProductCreate
NonPharmacyProductResponse = PharmacyProductResponse


# ── PURCHASE SCHEMAS ──────────────────────────────────────────────────────────

class PurchaseCreate(BaseModel):
    product_type: Optional[str] = "main"
    supplier: Optional[str] = None
    tradeName: Optional[str] = None
    category: Optional[str] = None
    strength: Optional[str] = None
    boxType: Optional[str] = None
    unitType: Optional[str] = None
    creator: Optional[str] = None
    createdAt: Optional[datetime] = None

class PurchaseResponse(BaseModel):
    id: int
    product_type: Optional[str] = None
    supplier: Optional[str] = None
    tradeName: Optional[str] = None
    category: Optional[str] = None
    strength: Optional[str] = None
    boxType: Optional[str] = None
    unitType: Optional[str] = None
    creator: Optional[str] = None
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── RETURN SCHEMAS ────────────────────────────────────────────────────────────

class ReturnCreate(BaseModel):
    return_type: Optional[str] = "customers"
    tradeName: Optional[str] = None
    genericName: Optional[str] = None
    strength: Optional[str] = None
    category: Optional[str] = None
    company: Optional[str] = None
    stock: Optional[int] = 0
    packType: Optional[str] = None
    purchaseUnitType: Optional[str] = None
    purchasePackSize: Optional[str] = None
    packTp: Optional[Decimal] = None
    unitTp: Optional[Decimal] = None
    purchaseVatPercent: Optional[Decimal] = None
    purchaseVatTaka: Optional[Decimal] = None
    purchaseDiscountPercent: Optional[Decimal] = None
    purchaseDiscountTaka: Optional[Decimal] = None
    salesUnitType: Optional[str] = None
    salePackSize: Optional[str] = None
    packMrp: Optional[Decimal] = None
    unitMrp: Optional[Decimal] = None
    salesVatPercent: Optional[Decimal] = None
    salesVatTaka: Optional[Decimal] = None
    salesDiscountPercent: Optional[Decimal] = None
    salesDiscountTaka: Optional[Decimal] = None
    addedBy: Optional[str] = None
    addedToDbAt: Optional[datetime] = None

class ReturnResponse(BaseModel):
    id: int
    return_type: Optional[str] = None
    tradeName: Optional[str] = None
    genericName: Optional[str] = None
    strength: Optional[str] = None
    category: Optional[str] = None
    company: Optional[str] = None
    stock: Optional[int] = None
    packType: Optional[str] = None
    purchaseUnitType: Optional[str] = None
    purchasePackSize: Optional[str] = None
    packTp: Optional[Decimal] = None
    unitTp: Optional[Decimal] = None
    purchaseVatPercent: Optional[Decimal] = None
    purchaseVatTaka: Optional[Decimal] = None
    purchaseDiscountPercent: Optional[Decimal] = None
    purchaseDiscountTaka: Optional[Decimal] = None
    salesUnitType: Optional[str] = None
    salePackSize: Optional[str] = None
    packMrp: Optional[Decimal] = None
    unitMrp: Optional[Decimal] = None
    salesVatPercent: Optional[Decimal] = None
    salesVatTaka: Optional[Decimal] = None
    salesDiscountPercent: Optional[Decimal] = None
    salesDiscountTaka: Optional[Decimal] = None
    addedBy: Optional[str] = None
    addedToDbAt: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── REQUESTED ITEM SCHEMAS ────────────────────────────────────────────────────

class RequestedItemCreate(BaseModel):
    item_type: Optional[str] = "main"
    tradeName: Optional[str] = None
    genericName: Optional[str] = None
    strength: Optional[str] = None
    category: Optional[str] = None
    company: Optional[str] = None
    stock: Optional[int] = 0
    packType: Optional[str] = None
    purchaseUnitType: Optional[str] = None
    purchasePackSize: Optional[str] = None
    packTp: Optional[Decimal] = None
    unitTp: Optional[Decimal] = None
    purchaseVatPercent: Optional[Decimal] = None
    purchaseVatTaka: Optional[Decimal] = None
    purchaseDiscountPercent: Optional[Decimal] = None
    purchaseDiscountTaka: Optional[Decimal] = None
    salesUnitType: Optional[str] = None
    salePackSize: Optional[str] = None
    packMrp: Optional[Decimal] = None
    unitMrp: Optional[Decimal] = None
    salesVatPercent: Optional[Decimal] = None
    salesVatTaka: Optional[Decimal] = None
    salesDiscountPercent: Optional[Decimal] = None
    salesDiscountTaka: Optional[Decimal] = None
    addedBy: Optional[str] = None
    addedToDbAt: Optional[datetime] = None

class RequestedItemResponse(BaseModel):
    id: int
    item_type: Optional[str] = None
    tradeName: Optional[str] = None
    genericName: Optional[str] = None
    strength: Optional[str] = None
    category: Optional[str] = None
    company: Optional[str] = None
    stock: Optional[int] = None
    packType: Optional[str] = None
    purchaseUnitType: Optional[str] = None
    purchasePackSize: Optional[str] = None
    packTp: Optional[Decimal] = None
    unitTp: Optional[Decimal] = None
    purchaseVatPercent: Optional[Decimal] = None
    purchaseVatTaka: Optional[Decimal] = None
    purchaseDiscountPercent: Optional[Decimal] = None
    purchaseDiscountTaka: Optional[Decimal] = None
    salesUnitType: Optional[str] = None
    salePackSize: Optional[str] = None
    packMrp: Optional[Decimal] = None
    unitMrp: Optional[Decimal] = None
    salesVatPercent: Optional[Decimal] = None
    salesVatTaka: Optional[Decimal] = None
    salesDiscountPercent: Optional[Decimal] = None
    salesDiscountTaka: Optional[Decimal] = None
    addedBy: Optional[str] = None
    addedToDbAt: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── EMPLOYEE SCHEMAS ──────────────────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

class EmployeeResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    addedBy: Optional[str] = None
    addedTime: Optional[datetime] = None
    updatedBy: Optional[str] = None
    updatedTime: Optional[datetime] = None

    class Config:
        from_attributes = True
