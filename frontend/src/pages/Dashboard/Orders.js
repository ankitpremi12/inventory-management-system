import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import ModalCloseButton from '../../components/Buttons/ModalCloseButton';
import ModalHeading from '../../components/Headings/ModalHeading';
import SaveButton from '../../components/Buttons/SaveButton';
import CancelButton from '../../components/Buttons/CancelButton';
import { fetchJson, postJson, deleteJson } from '../../api';

const ShoppingBagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Create Order state
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [orderItems, setOrderItems] = useState([{ product_id: '', quantity: 1 }]);

    // Detail Modal state
    const [viewingOrder, setViewingOrder] = useState(null);

    // Load orders, products, and customers
    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchJson('/orders'),
            fetchJson('/products'),
            fetchJson('/customers')
        ])
            .then(([ordersData, productsData, customersData]) => {
                setOrders(Array.isArray(ordersData) ? ordersData : []);
                setProducts(Array.isArray(productsData) ? productsData : []);
                setCustomers(Array.isArray(customersData) ? customersData : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading orders data:", err);
                toast.error("Failed to load orders data: " + err.message);
                setLoading(false);
            });
    }, [refreshTrigger]);

    // Handle order item updates
    const handleItemChange = (index, field, value) => {
        const updated = [...orderItems];
        updated[index][field] = value;
        setOrderItems(updated);
    };

    // Add item row in create form
    const addItemRow = () => {
        setOrderItems([...orderItems, { product_id: '', quantity: 1 }]);
    };

    // Remove item row in create form
    const removeItemRow = (index) => {
        if (orderItems.length > 1) {
            const updated = orderItems.filter((_, i) => i !== index);
            setOrderItems(updated);
        }
    };

    // Handle Create Order Submit
    const handleCreateOrder = (e) => {
        e.preventDefault();

        if (!selectedCustomerId) {
            toast.error("Please select a customer.");
            return;
        }

        // Validate items
        const validItems = orderItems.filter(item => item.product_id && item.quantity > 0);
        if (validItems.length === 0) {
            toast.error("Please add at least one product with quantity > 0.");
            return;
        }

        // Check stock locally first (friendly warning)
        for (const item of validItems) {
            const prod = products.find(p => p.id === parseInt(item.product_id, 10));
            if (prod && prod.quantity < item.quantity) {
                toast.error(`Insufficient stock for "${prod.name}". Available: ${prod.quantity}, Requested: ${item.quantity}`);
                return;
            }
        }

        const payload = {
            customer_id: parseInt(selectedCustomerId, 10),
            items: validItems.map(item => ({
                product_id: parseInt(item.product_id, 10),
                quantity: parseInt(item.quantity, 10)
            }))
        };

        postJson('/orders', payload)
            .then((newOrder) => {
                toast.success(`Order #${newOrder.id} created successfully!`);
                setRefreshTrigger(prev => prev + 1);
                // Reset form state
                setSelectedCustomerId('');
                setOrderItems([{ product_id: '', quantity: 1 }]);
                document.getElementById('create-order-modal').checked = false;
            })
            .catch(err => {
                toast.error(`Order Placement Failed: ${err.message}`);
            });
    };

    // Handle Delete Order (Cancel)
    const handleDeleteOrder = (id) => {
        if (window.confirm(`Are you sure you want to cancel order #${id}? Stock will be automatically restored.`)) {
            deleteJson(`/orders/${id}`)
                .then(() => {
                    toast.success(`Order #${id} has been canceled. Products restocked.`);
                    setRefreshTrigger(prev => prev + 1);
                })
                .catch(err => {
                    toast.error(`Failed to cancel order: ${err.message}`);
                });
        }
    };

    // Handle View Order Details
    const openOrderDetails = (order) => {
        setViewingOrder(order);
        document.getElementById('view-order-details-modal').checked = true;
    };

    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        Order Management
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        Process transactions, track sales, and inspect stock allocation details
                    </p>
                </div>
                <label
                    htmlFor="create-order-modal"
                    className="ims-btn cursor-pointer"
                    style={{
                        background: '#0c223c', color: '#ffffff',
                        padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
                    }}
                >
                    <span>+</span> Create New Order
                </label>
            </div>

            {/* Modal: Create Order */}
            <input type="checkbox" id="create-order-modal" className="modal-toggle" />
            <label htmlFor="create-order-modal" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-7/12 md:w-9/12 w-11/12 max-w-2xl relative" htmlFor="">
                    <ModalCloseButton modalId="create-order-modal" />
                    <ModalHeading modalHeading="Place an Order" />

                    <form onSubmit={handleCreateOrder}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                            {/* Customer Selector */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
                                    Select Customer *
                                </label>
                                <select
                                    className="ims-select"
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--navy-border)', background: '#ffffff' }}
                                >
                                    <option value="">-- Choose Customer --</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Order Items List */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
                                    Selected Items *
                                </label>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {orderItems.map((item, idx) => {
                                        const selectedProd = products.find(p => p.id === parseInt(item.product_id, 10));
                                        const stockAvailable = selectedProd ? selectedProd.quantity : 0;

                                        return (
                                            <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                {/* Product Selection */}
                                                <div style={{ flex: 2 }}>
                                                    <select
                                                        className="ims-select"
                                                        value={item.product_id}
                                                        onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                                                        required
                                                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--navy-border)', background: '#ffffff' }}
                                                    >
                                                        <option value="">-- Choose Product --</option>
                                                        {products.map(p => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name} (SKU: {p.sku || 'No SKU'}) - ₹{parseFloat(p.price).toFixed(2)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Quantity Input */}
                                                <div style={{ width: 100 }}>
                                                    <input
                                                        type="number"
                                                        className="ims-input"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                                                        required
                                                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--navy-border)' }}
                                                    />
                                                </div>

                                                {/* Stock helper text */}
                                                <div style={{ width: 80, fontSize: '0.75rem', color: stockAvailable <= 10 ? 'red' : 'green', fontWeight: 600 }}>
                                                    Stock: {stockAvailable}
                                                </div>

                                                {/* Actions */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeItemRow(idx)}
                                                    disabled={orderItems.length === 1}
                                                    style={{
                                                        padding: 6, borderRadius: 6, border: '1px solid #ef4444', color: '#ef4444',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent',
                                                        cursor: orderItems.length === 1 ? 'not-allowed' : 'pointer', opacity: orderItems.length === 1 ? 0.4 : 1
                                                    }}
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    onClick={addItemRow}
                                    style={{
                                        marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem',
                                        color: 'var(--teal)', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer'
                                    }}
                                >
                                    <FiPlus size={14} /> Add Product
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                            <CancelButton />
                            <SaveButton />
                        </div>
                    </form>
                </label>
            </label>

            {/* Modal: View Order Details */}
            <input type="checkbox" id="view-order-details-modal" className="modal-toggle" />
            <label htmlFor="view-order-details-modal" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-6/12 md:w-8/12 w-11/12 max-w-xl relative" htmlFor="">
                    <ModalCloseButton modalId="view-order-details-modal" onClose={() => setViewingOrder(null)} />
                    <ModalHeading modalHeading={viewingOrder ? `Order #${viewingOrder.id} Invoice` : "Order Details"} />

                    {viewingOrder && (
                        <div>
                            {/* Summary info */}
                            <div style={{ borderBottom: '1px solid var(--navy-border)', paddingBottom: 12, marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Customer Name</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{viewingOrder.customer_name}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Order Date</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {new Date(viewingOrder.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Items table */}
                            <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', marginBottom: 20 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--navy-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Product Name</th>
                                        <th style={{ padding: '6px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Qty</th>
                                        <th style={{ padding: '6px 0', textAlign: 'right', color: 'var(--text-secondary)' }}>Price</th>
                                        <th style={{ padding: '6px 0', textAlign: 'right', color: 'var(--text-secondary)' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewingOrder.items.map((item) => {
                                        const subtotal = parseFloat(item.price_at_order) * item.quantity;
                                        return (
                                            <tr key={item.id} style={{ borderBottom: '1px dotted var(--navy-border)' }}>
                                                <td style={{ padding: '8px 0', fontWeight: 600, color: 'var(--text-primary)' }}>{item.product_name || `Product ID ${item.product_id}`}</td>
                                                <td style={{ padding: '8px 0', textAlign: 'center' }}>{item.quantity}</td>
                                                <td style={{ padding: '8px 0', textAlign: 'right' }}>₹{parseFloat(item.price_at_order).toFixed(2)}</td>
                                                <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>₹{subtotal.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Total summary */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid var(--navy-border)', paddingTop: 10 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: 12 }}>Total Amount:</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--teal)' }}>
                                        ₹{parseFloat(viewingOrder.total_amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </label>
            </label>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--navy-border)', background: '#ffffff', marginTop: 12 }}>
                <table className="ims-table" style={{ minWidth: 800 }}>
                    <thead>
                        <tr>
                            <th style={{ width: 60, paddingLeft: 16 }}>Order ID</th>
                            <th>Customer Name</th>
                            <th>Date / Time</th>
                            <th style={{ textAlign: 'center' }}>Items Count</th>
                            <th>Total Amount</th>
                            <th style={{ textAlign: 'center', width: 120 }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                                    Loading orders...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                        <ShoppingBagIcon />
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: 'var(--text-secondary)' }}>No orders yet</p>
                                        <p style={{ fontSize: '0.8rem', margin: 0 }}>Click "+ Create New Order" to place your first sale</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const itemCount = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
                                const dateString = new Date(order.created_at).toLocaleString();
                                const priceStr = order.total_amount ? `₹${parseFloat(order.total_amount).toFixed(2)}` : '₹0.00';

                                return (
                                    <tr key={order.id} className="ims-table-row">
                                        <td style={{ paddingLeft: 16, fontWeight: 700 }}>#{order.id}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customer_name}</td>
                                        <td>{dateString}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{itemCount}</td>
                                        <td style={{ fontWeight: 800, color: 'var(--teal)' }}>{priceStr}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                <button
                                                    onClick={() => openOrderDetails(order)}
                                                    className="ims-btn ims-btn-ghost ims-btn-icon"
                                                    style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                                    title="View Details"
                                                >
                                                    <FiEye size={15} style={{ color: 'var(--text-secondary)' }} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="ims-btn ims-btn-ghost ims-btn-icon"
                                                    style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                                    title="Cancel Order"
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

export default Orders;
