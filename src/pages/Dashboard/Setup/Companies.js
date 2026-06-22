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

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchJson('/setup/companies')
            .then(products => setCompanies(products))
            .catch(err => console.error(err));
    }, [refreshTrigger]);

    const addCompany = event => {
        event.preventDefault();

        const name = event?.target?.companyName?.value;
        const phone = event?.target?.companyPhone?.value;
        const website = event?.target?.companyWebsite?.value;
        const email = event?.target?.companyEmail?.value;
        const address = event?.target?.companyAddress?.value;
        const addedBy = 'admin';
        const addedTime = new Date();
        const updatedBy = 'admin';
        const updatedTime = new Date();

        const productDetails = { name, phone, website, email, address, addedBy, addedTime, updatedBy, updatedTime };

        fetchJson('/setup/companies', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(productDetails)
        })
            .then(res => res.json())
            .then(() => {
                toast(<AddModal name={name} />);
                setRefreshTrigger(prev => prev + 1);
            })
            .catch(err => console.error(err));

        event.target.reset();
    };

    const deleteCompany = (id, name) => {
        if (window.confirm(`Are you sure you want to delete company ${name}?`)) {
            fetchJson(`/setup/companies/${id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    toast.success(`Company ${name} deleted`);
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
                    htmlFor="create-new-company"
                    className="ims-btn cursor-pointer"
                    style={{
                        background: '#0c223c', color: '#ffffff',
                        padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
                    }}
                >
                    <span>+</span> Add Company
                </label>
            </div>

            {/* Custom Sub-navigation Tabs */}
            <div className="ims-tabs-container">
                <Link to="/dashboard/setup/categories" className="ims-tab-btn">Categories</Link>
                <Link to="/dashboard/setup/unit-types" className="ims-tab-btn">Unit Types</Link>
                <Link to="/dashboard/setup/companies" className="ims-tab-btn active">Companies</Link>
                <Link to="/dashboard/employees" className="ims-tab-btn">Employees</Link>
                <Link to="/dashboard/customers" className="ims-tab-btn">Customers</Link>
            </div>

            {/* Create Company Modal */}
            <input type="checkbox" id="create-new-company" className="modal-toggle" />
            <label htmlFor="create-new-company" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-6/12 md:w-8/12 w-11/12 max-w-2xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-company'} />
                    <ModalHeading modalHeading={'Add a new Company'} />

                    <form onSubmit={addCompany}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: 20 }}>
                            <Input title={'Company Name'} name='companyName' isRequired='required' type='text' />
                            <Input title={'Company Phone'} name='companyPhone' isRequired='required' type='text' />
                            <Input title={'Company Website'} name='companyWebsite' isRequired='required' type='text' />
                            <Input title={'Company Email'} name='companyEmail' isRequired='required' type='email' />
                            <Input title={'Company Address'} name='companyAddress' isRequired='required' type='text' />
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
                <table className="ims-table" style={{ minWidth: 900 }}>
                    <thead>
                        <tr>
                            <th style={{ width: 60, paddingLeft: 16 }}>SN</th>
                            <th>Company Name</th>
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
                        {companies.map((company, index) => (
                            <tr key={company._id} className="ims-table-row">
                                <td style={{ paddingLeft: 16, fontWeight: 700 }}>{index + 1}</td>
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{company.name}</td>
                                <td>{company.phone}</td>
                                <td><a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>{company.website}</a></td>
                                <td>{company.email}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{company.address}</td>
                                <td>{company.addedBy}</td>
                                <td>{company?.addedTime?.slice(0, 10)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                                        <button className="ims-btn ims-btn-ghost ims-btn-icon" style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}>
                                            <FiEdit2 size={15} style={{ color: 'var(--text-secondary)' }} />
                                        </button>
                                        <button
                                            onClick={() => deleteCompany(company._id, company.name)}
                                            className="ims-btn ims-btn-ghost ims-btn-icon"
                                            style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                        >
                                            <FiTrash2 size={15} style={{ color: '#ef4444' }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Companies;