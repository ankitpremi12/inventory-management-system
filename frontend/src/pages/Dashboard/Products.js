import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import SaveButton from '../../components/Buttons/SaveButton';
import CancelButton from '../../components/Buttons/CancelButton';
import Input from '../../components/form/Input';
import ModalCloseButton from '../../components/Buttons/ModalCloseButton';
import ModalHeading from '../../components/Headings/ModalHeading';
import { fetchJson, postJson, putJson, deleteJson } from '../../api';

const PackageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Edit Product State
    const [editingProduct, setEditingProduct] = useState(null);

    // Load products
    useEffect(() => {
        setLoading(true);
        fetchJson('/products')
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading products:", err);
                toast.error("Failed to load products: " + err.message);
                setLoading(false);
            });
    }, [refreshTrigger]);

    // Handle create product
    const handleCreateProduct = (event) => {
        event.preventDefault();
        const name = event.target.productName.value;
        const sku = event.target.productSku.value;
        const price = parseFloat(event.target.productPrice.value);
        const quantity = parseInt(event.target.productQuantity.value, 10);

        postJson('/products', { name, sku, price, quantity })
            .then(() => {
                toast.success(`Product "${name}" added successfully!`);
                setRefreshTrigger(prev => prev + 1);
                event.target.reset();
                document.getElementById('create-new-product-modal').checked = false;
            })
            .catch(err => {
                toast.error(`Error adding product: ${err.message}`);
            });
    };

    // Handle edit button click
    const startEditProduct = (product) => {
        setEditingProduct(product);
        // Open modal
        document.getElementById('edit-product-modal').checked = true;
    };

    // Handle update product
    const handleUpdateProduct = (event) => {
        event.preventDefault();
        const name = event.target.editProductName.value;
        const sku = event.target.editProductSku.value;
        const price = parseFloat(event.target.editProductPrice.value);
        const quantity = parseInt(event.target.editProductQuantity.value, 10);

        putJson(`/products/${editingProduct.id}`, { name, sku, price, quantity })
            .then(() => {
                toast.success(`Product "${name}" updated successfully!`);
                setRefreshTrigger(prev => prev + 1);
                setEditingProduct(null);
                document.getElementById('edit-product-modal').checked = false;
            })
            .catch(err => {
                toast.error(`Error updating product: ${err.message}`);
            });
    };

    // Handle delete product
    const handleDeleteProduct = (id, name) => {
        if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
            deleteJson(`/products/${id}`)
                .then(() => {
                    toast.success(`Product "${name}" deleted successfully.`);
                    setRefreshTrigger(prev => prev + 1);
                })
                .catch(err => {
                    toast.error(`Error deleting product: ${err.message}`);
                });
        }
    };

    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        Product Management
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        Create, view, update, and delete products in your stock
                    </p>
                </div>
                <label
                    htmlFor="create-new-product-modal"
                    className="ims-btn cursor-pointer"
                    style={{
                        background: '#0c223c', color: '#ffffff',
                        padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
                    }}
                >
                    <span>+</span> Add New Product
                </label>
            </div>

            {/* Modal for creating product */}
            <input type="checkbox" id="create-new-product-modal" className="modal-toggle" />
            <label htmlFor="create-new-product-modal" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-6/12 md:w-8/12 w-11/12 max-w-xl relative" htmlFor="">
                    <ModalCloseButton modalId="create-new-product-modal" />
                    <ModalHeading modalHeading="Create a New Product" />

                    <form onSubmit={handleCreateProduct}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                            <Input title="Product Name" type="text" placeholder="Enter product name" name="productName" isRequired="required" />
                            <Input title="SKU / Unique Code" type="text" placeholder="Enter unique SKU code (optional)" name="productSku" />
                            <Input title="Price (₹)" type="number" step="0.01" placeholder="₹0.00" name="productPrice" isRequired="required" />
                            <Input title="Quantity in Stock" type="number" placeholder="0" name="productQuantity" isRequired="required" />
                        </div>

                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                            <CancelButton />
                            <SaveButton />
                        </div>
                    </form>
                </label>
            </label>

            {/* Modal for editing product */}
            <input type="checkbox" id="edit-product-modal" className="modal-toggle" />
            <label htmlFor="edit-product-modal" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-6/12 md:w-8/12 w-11/12 max-w-xl relative" htmlFor="">
                    <ModalCloseButton modalId="edit-product-modal" onClose={() => setEditingProduct(null)} />
                    <ModalHeading modalHeading="Edit Product Details" />

                    {editingProduct && (
                        <form onSubmit={handleUpdateProduct}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                                <Input title="Product Name" type="text" defaultValue={editingProduct.name} name="editProductName" isRequired="required" />
                                <Input title="SKU / Unique Code" type="text" defaultValue={editingProduct.sku} name="editProductSku" />
                                <Input title="Price (₹)" type="number" step="0.01" defaultValue={editingProduct.price} name="editProductPrice" isRequired="required" />
                                <Input title="Quantity in Stock" type="number" defaultValue={editingProduct.quantity} name="editProductQuantity" isRequired="required" />
                            </div>

                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingProduct(null);
                                        document.getElementById('edit-product-modal').checked = false;
                                    }}
                                    className="ims-btn ims-btn-ghost"
                                >
                                    Cancel
                                </button>
                                <SaveButton />
                            </div>
                        </form>
                    )}
                </label>
            </label>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--navy-border)', background: '#ffffff', marginTop: 12 }}>
                <table className="ims-table" style={{ minWidth: 800 }}>
                    <thead>
                        <tr>
                            <th style={{ width: 60, paddingLeft: 16 }}>#</th>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Stock Level</th>
                            <th>Unit Price</th>
                            <th style={{ textAlign: 'center', width: 120 }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                                    Loading products...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                            <line x1="12" y1="22.08" x2="12" y2="12" />
                                        </svg>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: 'var(--text-secondary)' }}>No products yet</p>
                                        <p style={{ fontSize: '0.8rem', margin: 0 }}>Click "+ Add New Product" to add your first item</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            products.map((product, idx) => {
                                const stock = product.quantity;
                                let statusText = 'In Stock';
                                let statusClass = 'ims-badge-success';
                                let progressClass = 'ims-progress-fill-success';
                                let fillPercentage = Math.min(100, Math.max(10, (stock / 100) * 100));

                                if (stock === 0) {
                                    statusText = 'Out of Stock';
                                    statusClass = 'ims-badge-danger';
                                    progressClass = 'ims-progress-fill-danger';
                                    fillPercentage = 0;
                                } else if (stock <= 10) {
                                    statusText = 'Low Stock';
                                    statusClass = 'ims-badge-warning';
                                    progressClass = 'ims-progress-fill-warning';
                                    fillPercentage = 15;
                                }

                                const price = product.price ? `₹${parseFloat(product.price).toFixed(2)}` : '₹0.00';

                                return (
                                    <tr key={product.id} className="ims-table-row">
                                        <td style={{ paddingLeft: 16, fontWeight: 500 }}>{idx + 1}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: 6, background: '#fcfaf6',
                                                    border: '1px solid var(--navy-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <PackageIcon />
                                                </div>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{product.sku}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontWeight: 700, minWidth: 28 }}>{stock}</span>
                                                <div className="ims-progress-bar" style={{ width: 80 }}>
                                                    <div className={`ims-progress-fill ${progressClass}`} style={{ width: `${fillPercentage}%` }} />
                                                </div>
                                                <span className={`ims-badge ${statusClass}`}>{statusText}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{price}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                <button
                                                    onClick={() => startEditProduct(product)}
                                                    className="ims-btn ims-btn-ghost ims-btn-icon"
                                                    style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                                    title="Edit Product"
                                                >
                                                    <FiEdit2 size={15} style={{ color: 'var(--text-secondary)' }} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                                    className="ims-btn ims-btn-ghost ims-btn-icon"
                                                    style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                                    title="Delete Product"
                                                >
                                                    <FiTrash2 size={15} style={{ color: '#ef4444' }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Products;
