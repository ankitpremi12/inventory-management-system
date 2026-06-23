import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPrinter, FiMail } from 'react-icons/fi';
import PrintButton from '../../../components/Buttons/PrintButton';
import RefreshButton from '../../../components/Buttons/RefreshButton';
import SaveButton from '../../../components/Buttons/SaveButton';
import CancelButton from '../../../components/Buttons/CancelButton';
import ModalCloseButton from '../../../components/Buttons/ModalCloseButton';
import ModalHeading from '../../../components/Headings/ModalHeading';
import Input from '../../../components/form/Input';
import AddModal from '../../../components/modals/AddModal';
import { apiBaseUrl } from '../../../api';
import { Link } from 'react-router-dom';

const BASE = apiBaseUrl;

const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const cls = s === 'completed' ? 'ims-badge-success' : s === 'pending' ? 'ims-badge-warning' : 'ims-badge';
    return <span className={`ims-badge ${cls}`}>{status || '—'}</span>;
};

const PharmacyOrders = () => {
    const [orders, setOrders]         = useState([]);
    const [loading, setLoading]       = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // ── Fetch orders ─────────────────────────────────────────────────
    useEffect(() => {
        setLoading(true);
        fetch(`${BASE}/orders/main`)
            .then(r => r.json())
            .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [refreshTrigger]);



    // ── Add order ────────────────────────────────────────────────────
    const addOrder = event => {
        event.preventDefault();
        const payload = {
            supplier:  event.target.supplier?.value,
            tradeName: event.target.tradeName?.value,
            category:  event.target.category?.value,
            strength:  event.target.strength?.value,
            unitType:  event.target.unitType?.value,
            status:    'Pending',
            creator:   'admin',
            createdAt: new Date().toISOString(),
        };
        fetch(`${BASE}/orders/main`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(r => r.json())
            .then(() => {
                toast(<AddModal name="Order" />);
                setRefreshTrigger(n => n + 1);
                document.getElementById('create-main-stock-order').checked = false;
                event.target.reset();
            })
            .catch(() => toast.error('Failed to create order.'));
    };

    // ── Delete order ─────────────────────────────────────────────────
    const deleteOrder = (id) => {
        if (!window.confirm('Delete this order?')) return;
        fetch(`${BASE}/orders/main/${id}`, { method: 'DELETE' })
            .then(r => r.json())
            .then(() => { toast.success('Order deleted.'); setRefreshTrigger(n => n + 1); })
            .catch(() => toast.error('Failed to delete order.'));
    };

    // ── Render ───────────────────────────────────────────────────────
    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Main Stock Orders</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{orders.length}</span> records
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <label
                        htmlFor="create-main-stock-order"
                        className="ims-btn cursor-pointer"
                        style={{ background: '#0c223c', color: '#ffffff', padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <span>+</span> New Order
                    </label>
                    <RefreshButton onClick={() => setRefreshTrigger(n => n + 1)} />
                    <PrintButton />
                </div>
            </div>

            {/* Tab nav */}
            <div className="ims-tabs-container">
                <Link to="/dashboard/orders/main"     className="ims-tab-btn active">Main Stock</Link>
                <Link to="/dashboard/orders/supplies" className="ims-tab-btn">Supplies</Link>
            </div>

            {/* Add Order Modal */}
            <input type="checkbox" id="create-main-stock-order" className="modal-toggle" />
            <label htmlFor="create-main-stock-order" className="modal cursor-pointer z-50">
                <label className="ims-modal-box modal-box lg:w-7/12 md:w-9/12 w-11/12 max-w-2xl relative" htmlFor="">
                    <ModalCloseButton modalId="create-main-stock-order" />
                    <ModalHeading modalHeading="Create a Main Stock Order" />
                    <form onSubmit={addOrder}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '12px 16px', marginBottom: 20 }}>
                            <Input  title="Supplier"   name="supplier"  isRequired="required" type="text" placeholder="Supplier/Company name" />
                            <Input  title="Item Name"  name="tradeName" isRequired="required" type="text" />
                            <Input  title="Category"   name="category"  isRequired="required" type="text" placeholder="Category" />
                            <Input  title="Strength / Spec" name="strength" type="text" />
                            <Input  title="Unit Type"  name="unitType"  isRequired="required" type="text" placeholder="Unit Type" />
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                            <CancelButton />
                            <SaveButton />
                        </div>
                    </form>
                </label>
            </label>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--navy-border)', marginTop: 16, background: '#ffffff' }}>
                <table className="ims-table" style={{ minWidth: 900 }}>
                    <thead>
                        <tr>
                            <th style={{ width: 50, paddingLeft: 16 }}>SN</th>
                            <th>Voucher</th>
                            <th>Supplier</th>
                            <th>Item</th>
                            <th>Status</th>
                            <th>Qty</th>
                            <th>VAT</th>
                            <th>Discount</th>
                            <th>MRP</th>
                            <th>Creator</th>
                            <th>Created At</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={12} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Loading…</td></tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={12} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                                        </svg>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: 'var(--text-secondary)' }}>No orders yet</p>
                                        <p style={{ fontSize: '0.8rem', margin: 0 }}>Click "+ New Order" to create your first order</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, index) => (
                                <tr key={order._id} className="ims-table-row">
                                    <td style={{ paddingLeft: 16, fontWeight: 700 }}>{index + 1}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{order.voucher || '—'}</td>
                                    <td>{order.supplier}</td>
                                    <td style={{ fontWeight: 600 }}>{order.tradeName || order.name}</td>
                                    <td>{statusBadge(order.status)}</td>
                                    <td>{order.quantity ?? '—'}</td>
                                    <td>{order.vat != null ? `${order.vat}%` : '—'}</td>
                                    <td>{order.discount != null ? `${order.discount}%` : '—'}</td>
                                    <td style={{ fontWeight: 600 }}>{order.mrp != null ? `$${parseFloat(order.mrp).toFixed(2)}` : '—'}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{order.creator}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{order?.createdAt?.slice(0, 10)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                                            <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}>
                                                <FiEdit2 size={14} style={{ color: 'var(--text-secondary)' }} />
                                            </button>
                                            <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}>
                                                <FiPrinter size={14} style={{ color: 'var(--text-secondary)' }} />
                                            </button>
                                            <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}>
                                                <FiMail size={14} style={{ color: 'var(--text-secondary)' }} />
                                            </button>
                                            <button
                                                onClick={() => deleteOrder(order._id)}
                                                className="ims-btn ims-btn-ghost ims-btn-icon"
                                                style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                            >
                                                <FiTrash2 size={14} style={{ color: '#ef4444' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default PharmacyOrders;