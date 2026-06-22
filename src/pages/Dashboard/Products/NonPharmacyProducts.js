import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import SaveButton from '../../../components/Buttons/SaveButton';
import CancelButton from '../../../components/Buttons/CancelButton';
import Input from '../../../components/form/Input';
import DoubleInput from '../../../components/form/DoubleInput';
import ModalCloseButton from '../../../components/Buttons/ModalCloseButton';
import ModalHeading from '../../../components/Headings/ModalHeading';
import AddModal from '../../../components/modals/AddModal';
import { fetchJson } from '../../../api';

const PackageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const NonPharmacyProducts = () => {
    const [nonPharmacyProducts, setNonPharmacyProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Filters state
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedStockLevel, setSelectedStockLevel] = useState('');

    useEffect(() => {
        fetchJson('/products/supplies')
            .then(products => setNonPharmacyProducts(products))
            .catch(err => console.error("Error loading products:", err));
    }, [refreshTrigger]);

    useEffect(() => {
        fetchJson('/setup/categories')
            .then(c => setCategories(c))
            .catch(err => console.error(err));
    }, []);

    const addNonPharmacyProduct = event => {
        event.preventDefault();

        const tradeName = event?.target?.tradeName?.value;
        const genericName = event?.target?.genericName?.value;
        const strength = event?.target?.strength?.value;
        const category = event?.target?.category?.value;
        const company = event?.target?.company?.value;
        const stock = event?.target?.stock?.value || 0;
        const packType = event?.target?.packType?.value || 'Box';
        const purchaseUnitType = event?.target?.purchaseUnitType?.value;
        const purchasePackSize = event?.target?.packSize?.value;
        const packTp = event?.target?.packTp?.value;
        const unitTp = event?.target?.unitTp?.value;
        const purchaseVatPercent = event?.target?.purchaseVatPercent?.value;
        const purchaseVatTaka = event?.target?.purchaseVatTaka?.value;
        const purchaseDiscountPercent = event?.target?.purchaseDiscountPercent?.value;
        const purchaseDiscountTaka = event?.target?.purchaseDiscountTaka?.value;
        const salesUnitType = event?.target?.salesUnitType?.value;
        const salePackSize = event?.target?.salePackSize?.value;
        const packMrp = event?.target?.packMrp?.value;
        const unitMrp = event?.target?.unitMrp?.value;
        const salesVatPercent = event?.target?.salesVatPercent?.value;
        const salesVatTaka = event?.target?.salesVatTaka?.value;
        const salesDiscountPercent = event?.target?.salesDiscountPercent?.value;
        const salesDiscountTaka = event?.target?.salesDiscountTaka?.value;
        const addedBy = 'admin';
        const addedToDbAt = new Date();

        const productDetails = { tradeName, genericName, strength, category, company, stock, packType, purchaseUnitType, purchasePackSize, packTp, unitTp, purchaseVatPercent, purchaseVatTaka, purchaseDiscountPercent, purchaseDiscountTaka, salesUnitType, salePackSize, packMrp, unitMrp, salesVatPercent, salesVatTaka, salesDiscountPercent, salesDiscountTaka, addedBy, addedToDbAt };

        fetchJson('/products/supplies', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(productDetails)
        })
            .then(res => res.json())
            .then(() => {
                toast(<AddModal name={tradeName} />);
                setRefreshTrigger(prev => prev + 1);
            })
            .catch(err => console.error(err));

        event.target.reset();
    };

    const deleteProduct = (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            fetchJson(`/products/supplies/${id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    toast.success(`${name} deleted successfully`);
                    setRefreshTrigger(prev => prev + 1);
                })
                .catch(err => console.error(err));
        }
    };

    // Calculate stats
    const totalItems = nonPharmacyProducts.length;
    const inStockCount = nonPharmacyProducts.filter(p => parseInt(p.stock || 0) > 100).length;
    const lowStockCount = nonPharmacyProducts.filter(p => parseInt(p.stock || 0) > 0 && parseInt(p.stock || 0) <= 100).length;
    const outOfStockCount = nonPharmacyProducts.filter(p => parseInt(p.stock || 0) === 0).length;

    // Filtered and Sorted products
    const filteredProducts = nonPharmacyProducts.filter(product => {
        const matchesCategory = !selectedCategory || selectedCategory === 'Category' || product.category === selectedCategory;
        const matchesStatus = !selectedStatus || selectedStatus === 'Status' || (() => {
            const stock = parseInt(product.stock || 0);
            if (selectedStatus === 'In Stock') return stock > 100;
            if (selectedStatus === 'Low Stock') return stock > 0 && stock <= 100;
            if (selectedStatus === 'Out of Stock') return stock === 0;
            return true;
        })();
        return matchesCategory && matchesStatus;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (selectedStockLevel === 'High to Low') {
            return parseInt(b.stock || 0) - parseInt(a.stock || 0);
        }
        if (selectedStockLevel === 'Low to High') {
            return parseInt(a.stock || 0) - parseInt(b.stock || 0);
        }
        return 0;
    });

    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Inventory Overview
                </h1>
                <label
                    htmlFor="create-new-product"
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

            {/* Custom Sub-navigation Tabs */}
            <div className="ims-tabs-container">
                <Link to="/dashboard/products/main" className="ims-tab-btn">Main Stock</Link>
                <Link to="/dashboard/products/supplies" className="ims-tab-btn active">Supplies</Link>
            </div>

            {/* Filters and Stats Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
                {/* Filters */}
                <div style={{ flex: 1, minWidth: 320 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Quick Filter</p>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <select
                            className="ims-select"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            style={{ borderRadius: 8, background: '#ffffff', minWidth: 120 }}
                        >
                            <option value="">Category</option>
                            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>

                        <select
                            className="ims-select"
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value)}
                            style={{ borderRadius: 8, background: '#ffffff', minWidth: 120 }}
                        >
                            <option value="">Status</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>

                        <select
                            className="ims-select"
                            value={selectedStockLevel}
                            onChange={e => setSelectedStockLevel(e.target.value)}
                            style={{ borderRadius: 8, background: '#ffffff', minWidth: 120 }}
                        >
                            <option value="">Stock Level</option>
                            <option value="High to Low">High to Low</option>
                            <option value="Low to High">Low to High</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ background: '#ffffff', border: '1px solid var(--navy-border)', borderRadius: 12, padding: '12px 20px', minWidth: 110 }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>Total Items</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{totalItems}</p>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid var(--navy-border)', borderRadius: 12, padding: '12px 20px', minWidth: 110 }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>In Stock</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{inStockCount}</p>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid var(--navy-border)', borderRadius: 12, padding: '12px 20px', minWidth: 110 }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>Low Stock</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b45309', margin: 0 }}>{lowStockCount}</p>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid var(--navy-border)', borderRadius: 12, padding: '12px 20px', minWidth: 110 }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>Out of Stock</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b91c1c', margin: 0 }}>{outOfStockCount}</p>
                    </div>
                </div>
            </div>

            {/* Modal for creating product */}
            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-8/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />
                    <ModalHeading modalHeading={'Create a Supplies Product'} />

                    <form onSubmit={addNonPharmacyProduct}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '10px 14px', marginBottom: 20 }}>
                            <Input title={'Trade Name'} type='text' placeholder='Trade name' name='tradeName' isRequired='required' />
                            <Input title={'Generic Name'} type='text' placeholder='Generic name' name='genericName' isRequired='required' />
                            <Input title={'Strength'} type='number' placeholder='Strength' name='strength' isRequired='required' />
                            <Input title={'Category'} type='text' placeholder='Category name' name='category' isRequired='required' />
                            <Input title={'Company'} type='text' placeholder='Company name' name='company' isRequired='required' />
                            <Input title={'Stock'} type='number' placeholder='Stock' name='stock' isRequired='required' />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Purchase Area</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <Input title={'Purchase Unit Type'} type='text' placeholder='Unit type' name='purchaseUnitType' isRequired='required' />
                                    <Input title={'Pack Size'} type='number' placeholder='Pack size' name='packSize' isRequired='required' />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <Input title={'Pack TP'} type='number' placeholder='Pack TP' name='packTp' isRequired='required' />
                                        <Input title={'Unit TP'} type='number' placeholder='Unit TP' name='unitTp' isRequired='required' />
                                    </div>
                                    <DoubleInput title={'Purchase VAT'} name1='purchaseVatPercent' name2='purchaseVatTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' />
                                    <DoubleInput title={'Purchase Discount'} name1='purchaseDiscountPercent' name2='purchaseDiscountTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' />
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--violet)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Sale Area</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <Input title={'Sales Unit Type'} type='text' placeholder='Unit type' name='salesUnitType' isRequired='required' />
                                    <Input title={'Pack Size'} type='number' name='salePackSize' placeholder='Pack size' isRequired='required' />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <Input title={'Pack MRP'} type='number' name='packMrp' placeholder='Pack MRP' isRequired='required' />
                                        <Input title={'Unit MRP'} type='number' name='unitMrp' placeholder='Unit MRP' isRequired='required' />
                                    </div>
                                    <DoubleInput title={'Sales VAT'} name1='salesVatPercent' name2='salesVatTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' />
                                    <DoubleInput title={'Sales Discount'} name1='salesDiscountPercent' name2='salesDiscountTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                            <CancelButton />
                            <SaveButton />
                        </div>
                    </form>
                </label>
            </label>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--navy-border)', background: '#ffffff' }}>
                <table className="ims-table" style={{ minWidth: 1100 }}>
                    <thead>
                        <tr>
                            <th style={{ width: 40, paddingLeft: 16 }}>
                                <input type="checkbox" style={{ accentColor: '#0c223c' }} />
                            </th>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Stock Level</th>
                            <th>Supplier</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.map((product, idx) => {
                            const stock = parseInt(product.stock || 0);
                            let statusText = 'In Stock';
                            let statusClass = 'ims-badge-success';
                            let progressClass = 'ims-progress-fill-success';
                            let fillPercentage = Math.min(100, Math.max(10, (stock / 1500) * 100));

                            if (stock === 0) {
                                statusText = 'Out of Stock';
                                statusClass = 'ims-badge-danger';
                                progressClass = 'ims-progress-fill-danger';
                                fillPercentage = 0;
                            } else if (stock <= 100) {
                                statusText = 'Low Stock';
                                statusClass = 'ims-badge-warning';
                                progressClass = 'ims-progress-fill-warning';
                                fillPercentage = 15;
                            }

                            const sku = product.genericName || '';
                            const location = product.location || '';
                            const price = product.unitMrp ? `$${parseFloat(product.unitMrp).toFixed(2)}` : '—';

                            return (
                                <tr key={product._id} className="ims-table-row">
                                    <td style={{ paddingLeft: 16 }}>
                                        <input type="checkbox" style={{ accentColor: '#0c223c' }} />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 6, background: '#fcfaf6',
                                                border: '1px solid var(--navy-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <PackageIcon />
                                            </div>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.tradeName}</span>
                                        </div>
                                    </td>
                                    <td>{sku}</td>
                                    <td>{product.category}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontWeight: 700, minWidth: 28 }}>{stock}</span>
                                            <div className="ims-progress-bar" style={{ width: 80 }}>
                                                <div className={`ims-progress-fill ${progressClass}`} style={{ width: `${fillPercentage}%` }} />
                                            </div>
                                            <span className={`ims-badge ${statusClass}`}>{statusText}</span>
                                        </div>
                                    </td>
                                    <td>{product.company}</td>
                                    <td>{location}</td>
                                    <td style={{ fontWeight: 600 }}>{price}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                            <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}>
                                                <FiEye size={15} style={{ color: 'var(--text-secondary)' }} />
                                            </button>
                                            <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}>
                                                <FiEdit2 size={15} style={{ color: 'var(--text-secondary)' }} />
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product._id, product.tradeName)}
                                                className="ims-btn ims-btn-ghost ims-btn-icon"
                                                style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                            >
                                                <FiTrash2 size={15} style={{ color: '#ef4444' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {sortedProducts.length === 0 && (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
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
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24 }}>
                <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ borderRadius: 6, background: '#ffffff', width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    &lt;
                </button>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Page <span style={{ background: '#0c223c', color: '#ffffff', padding: '4px 10px', borderRadius: 4, fontWeight: 700, margin: '0 4px' }}>1</span> of 12
                </span>
                <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ borderRadius: 6, background: '#ffffff', width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    &gt;
                </button>
            </div>
        </section>
    );
};

export default NonPharmacyProducts;