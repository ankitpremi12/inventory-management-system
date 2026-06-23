import React, { useEffect, useState } from 'react';
import PrintButton from '../../components/Buttons/PrintButton';
import Input from '../../components/form/Input';
import TableRow from '../../components/TableRow';
import RefreshButton from '../../components/Buttons/RefreshButton';
import DashboardPageHeading from '../../components/Headings/DashboardPageHeading';
import SaveButton from '../../components/Buttons/SaveButton';
import CancelButton from '../../components/Buttons/CancelButton';
import ModalHeading from '../../components/Headings/ModalHeading';
import ModalCloseButton from '../../components/Buttons/ModalCloseButton';
import NewButton from '../../components/Buttons/NewButton';
import AddModal from '../../components/modals/AddModal';
import { toast } from 'react-toastify';
import { fetchJson, postJson, deleteJson } from '../../api';
import { FiTrash2 } from 'react-icons/fi';

const Customers = () => {
    const tableHeadItems = ['#', 'Full Name', 'Email Address', 'Phone Number', 'Actions'];
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchJson('/customers')
            .then(data => { 
                setCustomers(Array.isArray(data) ? data : []); 
                setLoading(false); 
            })
            .catch((err) => {
                console.error("Error fetching customers:", err);
                toast.error("Failed to load customers: " + err.message);
                setLoading(false);
            });
    }, [refreshTrigger]);

    const addCustomer = event => {
        event.preventDefault();
        const name = event.target.customerName.value;
        const email = event.target.customerEmail.value;
        const phone = event.target.customerPhone.value;

        postJson('/customers', { name, email, phone })
            .then(() => {
                toast(<AddModal name={name} />);
                setRefreshTrigger(n => n + 1);
                event.target.reset();
                document.getElementById('create-new-customer').checked = false;
            })
            .catch(err => {
                toast.error(`Error adding customer: ${err.message}`);
            });
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
            deleteJson(`/customers/${id}`)
                .then(() => {
                    toast.success(`Customer "${name}" deleted.`);
                    setRefreshTrigger(n => n + 1);
                })
                .catch(err => {
                    toast.error(`Error deleting customer: ${err.message}`);
                });
        }
    };

    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <DashboardPageHeading
                name="Customers"
                value={customers.length}
                buttons={[
                    <NewButton modalId="create-new-customer" />,
                    <RefreshButton onClick={() => setRefreshTrigger(n => n + 1)} />,
                    <PrintButton />,
                ]}
            />

            {/* Add modal */}
            <input type="checkbox" id="create-new-customer" className="modal-toggle" />
            <label htmlFor="create-new-customer" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-6/12 md:w-8/12 w-11/12 max-w-xl relative" htmlFor="">
                    <ModalCloseButton modalId="create-new-customer" />
                    <ModalHeading modalHeading="Add a New Customer" />
                    <form onSubmit={addCustomer}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                            <Input title="Full Name" name="customerName" isRequired="required" type="text" placeholder="John Doe" />
                            <Input title="Email Address" name="customerEmail" isRequired="required" type="email" placeholder="john.doe@example.com" />
                            <Input title="Phone Number" name="customerPhone" isRequired="required" type="text" placeholder="+123456789" />
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                            <CancelButton />
                            <SaveButton />
                        </div>
                    </form>
                </label>
            </label>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--navy-border)', marginTop: 12, background: '#ffffff' }}>
                <table className="ims-table" style={{ minWidth: 800 }}>
                    <thead>
                        <tr>
                            {tableHeadItems.map((h, i) => <th key={i}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading customers...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No customers found.</td></tr>
                        ) : (
                            customers.map((customer, index) => (
                                <TableRow
                                    key={customer.id}
                                    tableRowsData={[
                                        index + 1,
                                        customer.name,
                                        customer.email,
                                        customer.phone,
                                        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleDelete(customer.id, customer.name)}
                                                className="ims-btn ims-btn-ghost ims-btn-icon"
                                                style={{ background: 'transparent', borderColor: 'transparent', padding: 4 }}
                                                title="Delete Customer"
                                            >
                                                <FiTrash2 size={15} style={{ color: '#ef4444' }} />
                                            </button>
                                        </span>,
                                    ]}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Customers;