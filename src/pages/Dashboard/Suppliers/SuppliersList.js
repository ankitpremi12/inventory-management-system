import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import PrintButton from '../../../components/Buttons/PrintButton';
import RefreshButton from '../../../components/Buttons/RefreshButton';
import NewButton from '../../../components/Buttons/NewButton';
import SaveButton from '../../../components/Buttons/SaveButton';
import CancelButton from '../../../components/Buttons/CancelButton';
import ModalCloseButton from '../../../components/Buttons/ModalCloseButton';
import ModalHeading from '../../../components/Headings/ModalHeading';
import DashboardPageHeading from '../../../components/Headings/DashboardPageHeading';
import Input from '../../../components/form/Input';
import { apiBaseUrl } from '../../../api';

const BASE = apiBaseUrl;

const SuppliersList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading]     = useState(true);

    // Increment this to trigger a re-fetch without putting `suppliers`
    // in the dependency array (which would cause an infinite loop).
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // ── Data fetching ────────────────────────────────────────────────
    useEffect(() => {
        setLoading(true);
        fetch(`${BASE}/suppliers/lists`)
            .then(res => res.json())
            .then(data => { setSuppliers(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [refreshTrigger]);

    // ── Add supplier ─────────────────────────────────────────────────
    const addSupplier = event => {
        event.preventDefault();
        const name    = event.target.SupplierName?.value;
        const phone   = event.target.SupplierPhone?.value;
        const website = event.target.SupplierWebsite?.value;
        const email   = event.target.SupplierEmail?.value;
        const address = event.target.SupplierAddress?.value;

        const payload = {
            name, phone, website, email, address,
            addedBy: 'admin', addedTime: new Date().toISOString(),
            updatedBy: 'admin', updatedTime: new Date().toISOString(),
        };

        fetch(`${BASE}/suppliers/lists`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(res => res.json())
            .then(() => {
                toast.success(`${name} added successfully.`);
                setRefreshTrigger(n => n + 1);
                // close modal
                const toggle = document.getElementById('create-new-supplier');
                if (toggle) toggle.checked = false;
                event.target.reset();
            })
            .catch(() => toast.error('Failed to add supplier.'));
    };

    // ── Delete supplier ──────────────────────────────────────────────
    const deleteSupplier = (id, name) => {
        if (!window.confirm(`Delete supplier "${name}"?`)) return;
        fetch(`${BASE}/suppliers/lists/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                toast.success(`${name} deleted.`);
                setRefreshTrigger(n => n + 1);
            })
            .catch(() => toast.error('Failed to delete supplier.'));
    };

    // ── Render ───────────────────────────────────────────────────────
    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <DashboardPageHeading
                name="Suppliers"
                value={suppliers.length}
                buttons={[
                    <NewButton modalId="create-new-supplier" />,
                    <RefreshButton onClick={() => setRefreshTrigger(n => n + 1)} />,
                    <PrintButton />,
                ]}
            />

            {/* ── Add Supplier Modal ─────────────────────────────── */}
            <input type="checkbox" id="create-new-supplier" className="modal-toggle" />
            <label htmlFor="create-new-supplier" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-6/12 md:w-8/12 w-11/12 max-w-2xl relative" htmlFor="">
                    <ModalCloseButton modalId="create-new-supplier" />
                    <ModalHeading modalHeading="Add a New Supplier" />

                    <form onSubmit={addSupplier}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '12px 16px', marginBottom: 20 }}>
                            <Input title="Supplier Name"    name="SupplierName"    isRequired="required" type="text" />
                            <Input title="Supplier Phone"   name="SupplierPhone"   isRequired="required" type="text" />
                            <Input title="Supplier Website" name="SupplierWebsite" type="text" />
                            <Input title="Supplier Email"   name="SupplierEmail"   type="email" />
                            <Input title="Supplier Address" name="SupplierAddress" isRequired="required" type="text" />
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                            <CancelButton />
                            <SaveButton />
                        </div>
                    </form>
                </label>
            </label>

            {/* ── Table ─────────────────────────────────────────── */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--navy-border)', marginTop: 16, background: '#ffffff' }}>
                <table className="ims-table" style={{ minWidth: 900 }}>
                    <thead>
                        <tr>
                            <th style={{ width: 50, paddingLeft: 16 }}>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Website</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Creator</th>
                            <th>Created At</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                                    Loading…
                                </td>
                            </tr>
                        ) : suppliers.length === 0 ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="1" y="3" width="15" height="13" rx="2" />
                                            <path d="M16 8h4l3 4v4h-7V8z" />
                                            <circle cx="5.5" cy="18.5" r="2.5" />
                                            <circle cx="18.5" cy="18.5" r="2.5" />
                                        </svg>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: 'var(--text-secondary)' }}>No suppliers yet</p>
                                        <p style={{ fontSize: '0.8rem', margin: 0 }}>Click "+ Add New" to add your first supplier</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            suppliers.map((supplier, index) => (
                                <tr key={supplier._id} className="ims-table-row">
                                    <td style={{ paddingLeft: 16, fontWeight: 700 }}>{index + 1}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{supplier.name}</td>
                                    <td>{supplier.phone}</td>
                                    <td>
                                        {supplier.website
                                            ? <a href={supplier.website} target="_blank" rel="noreferrer" style={{ color: '#0c223c', textDecoration: 'underline' }}>{supplier.website}</a>
                                            : '—'}
                                    </td>
                                    <td>{supplier.email}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{supplier.address}</td>
                                    <td>{supplier.addedBy}</td>
                                    <td>{supplier?.addedTime?.slice(0, 10)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                            <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}>
                                                <FiEdit2 size={15} style={{ color: 'var(--text-secondary)' }} />
                                            </button>
                                            <button
                                                onClick={() => deleteSupplier(supplier._id, supplier.name)}
                                                className="ims-btn ims-btn-ghost ims-btn-icon"
                                                style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                            >
                                                <FiTrash2 size={15} style={{ color: '#ef4444' }} />
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

export default SuppliersList;