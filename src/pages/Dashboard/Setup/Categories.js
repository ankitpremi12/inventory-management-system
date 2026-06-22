import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import Input from '../../../components/form/Input';
import SaveButton from '../../../components/Buttons/SaveButton';
import ModalCloseButton from '../../../components/Buttons/ModalCloseButton';
import ModalHeading from '../../../components/Headings/ModalHeading';
import CancelButton from '../../../components/Buttons/CancelButton';
import AddModal from '../../../components/modals/AddModal';
import { fetchJson } from '../../../api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchJson('/setup/categories')
            .then(products => setCategories(products))
            .catch(err => console.error(err));
    }, [refreshTrigger]);

    const addCategory = event => {
        event.preventDefault();

        const name = event?.target?.categoryName?.value;
        const description = event?.target?.categoryDescription?.value;
        const addedBy = 'admin';
        const addedTime = new Date();
        const updatedBy = 'admin';
        const updatedTime = new Date();

        const categoryDetails = { name, description, addedBy, addedTime, updatedBy, updatedTime };

        fetchJson('/setup/categories', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(categoryDetails)
        })
            .then(res => res.json())
            .then(() => {
                toast(<AddModal name={name} />);
                setRefreshTrigger(prev => prev + 1);
            })
            .catch(err => console.error(err));

        event.target.reset();
    };

    const deleteCategory = (id, name) => {
        if (window.confirm(`Are you sure you want to delete category ${name}?`)) {
            fetchJson(`/setup/categories/${id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    toast.success(`Category ${name} deleted`);
                    setRefreshTrigger(prev => prev + 1);
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    System Setup
                </h1>
                <label
                    htmlFor="create-new-category"
                    className="ims-btn cursor-pointer"
                    style={{
                        background: '#0c223c', color: '#ffffff',
                        padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
                    }}
                >
                    <span>+</span> Add Category
                </label>
            </div>

            {/* Custom Sub-navigation Tabs */}
            <div className="ims-tabs-container">
                <Link to="/dashboard/setup/categories" className="ims-tab-btn active">Categories</Link>
                <Link to="/dashboard/setup/unit-types" className="ims-tab-btn">Unit Types</Link>
                <Link to="/dashboard/setup/companies" className="ims-tab-btn">Companies</Link>
                <Link to="/dashboard/employees" className="ims-tab-btn">Employees</Link>
                <Link to="/dashboard/customers" className="ims-tab-btn">Customers</Link>
            </div>

            {/* Create Category Modal */}
            <input type="checkbox" id="create-new-category" className="modal-toggle" />
            <label htmlFor="create-new-category" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-6/12 md:w-8/12 w-11/12 max-w-2xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-category'} />
                    <ModalHeading modalHeading={'Create a New Category'} />

                    <form onSubmit={addCategory}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: 20 }}>
                            <Input title={'Category Name'} name='categoryName' isRequired='required' />
                            <Input title={'Description'} name='categoryDescription' isRequired='required' />
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
                <table className="ims-table" style={{ minWidth: 800 }}>
                    <thead>
                        <tr>
                            <th style={{ width: 60, paddingLeft: 16 }}>SN</th>
                            <th>Category Name</th>
                            <th>Description</th>
                            <th>Creator</th>
                            <th>Created At</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category._id} className="ims-table-row">
                                <td style={{ paddingLeft: 16, fontWeight: 700 }}>{index + 1}</td>
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{category.name}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{category.description}</td>
                                <td>{category.addedBy}</td>
                                <td>{category?.addedTime?.slice(0, 10)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                        <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}>
                                            <FiEdit2 size={15} style={{ color: 'var(--text-secondary)' }} />
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category._id, category.name)}
                                            className="ims-btn ims-btn-ghost ims-btn-icon"
                                            style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                        >
                                            <FiTrash2 size={15} style={{ color: '#ef4444' }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: 'var(--text-secondary)' }}>No categories yet</p>
                                        <p style={{ fontSize: '0.8rem', margin: 0 }}>Click "+ Add Category" to create your first category</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Categories;