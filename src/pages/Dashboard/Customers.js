import React, { useEffect, useState } from 'react';
import PrintButton from '../../components/Buttons/PrintButton';
import Input from '../../components/form/Input';
import TableRow from '../../components/TableRow';
import EditButton from '../../components/Buttons/EditButton';
import DeleteButton from '../../components/Buttons/DeleteButton';
import RefreshButton from '../../components/Buttons/RefreshButton';
import DashboardPageHeading from '../../components/Headings/DashboardPageHeading';
import SaveButton from '../../components/Buttons/SaveButton';
import CancelButton from '../../components/Buttons/CancelButton';
import ModalHeading from '../../components/Headings/ModalHeading';
import ModalCloseButton from '../../components/Buttons/ModalCloseButton';
import NewButton from '../../components/Buttons/NewButton';
import AddModal from '../../components/modals/AddModal';
import { toast } from 'react-toastify';
import { fetchJson } from '../../api';

const Customers = () => {
    const tableHeadItems = ['#', 'Name', 'Phone', 'Website', 'Email', 'Address', 'Creator', 'Created At', 'Updated By', 'Updated At', 'Actions'];
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchJson('/customers')
            .then(data => { setCustomers(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [refreshTrigger]);

    const addCustomer = event => {
        event.preventDefault();
        const name    = event?.target?.customerName?.value;
        const phone   = event?.target?.customerPhone?.value;
        const website = event?.target?.customerWebsite?.value;
        const email   = event?.target?.customerEmail?.value;
        const address = event?.target?.customerAddress?.value;
        const addedBy = 'admin';
        const addedTime   = new Date();
        const updatedBy   = 'admin';
        const updatedTime = new Date();

        fetchJson('/customers', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name, phone, website, email, address, addedBy, addedTime, updatedBy, updatedTime }),
        })
            .then(res => res.json())
            .then(() => {
                toast(<AddModal name={name} />);
                setRefreshTrigger(n => n + 1);
                document.getElementById('create-new-customer').checked = false;
            });
    };

    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <DashboardPageHeading
                name="Customers"
                value={customers.length}
                buttons={[
                    <NewButton modalId="create-new-customer" />,
                    <RefreshButton />,
                    <PrintButton />,
                ]}
            />

            {/* Add modal */}
            <input type="checkbox" id="create-new-customer" className="modal-toggle" />
            <label htmlFor="create-new-customer" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-2xl relative" htmlFor="">
                    <ModalCloseButton modalId="create-new-customer" />
                    <ModalHeading modalHeading="Add a new Customer" />
                    <form onSubmit={addCustomer}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '12px 16px', marginBottom: 20 }}>
                            <Input title="Customer Name"    name="customerName"    isRequired="required" type="text" />
                            <Input title="Customer Phone"   name="customerPhone"   isRequired="required" type="text" />
                            <Input title="Customer Website" name="customerWebsite" type="text" />
                            <Input title="Customer Email"   name="customerEmail"   type="email" />
                            <Input title="Customer Address" name="customerAddress" isRequired="required" type="text" />
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                            <CancelButton />
                            <SaveButton />
                        </div>
                    </form>
                </label>
            </label>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--navy-border)', marginTop: 8 }}>
                <table className="ims-table" style={{ minWidth: 900 }}>
                    <thead>
                        <tr>
                            {tableHeadItems.map((h, i) => <th key={i}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={11} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading…</td></tr>
                        ) : customers.length === 0 ? (
                            <tr><td colSpan={11} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No customers found.</td></tr>
                        ) : (
                            customers.map((customer, index) => (
                                <TableRow
                                    key={customer._id}
                                    tableRowsData={[
                                        index + 1,
                                        customer.name,
                                        customer.phone,
                                        customer.website,
                                        customer.email,
                                        customer.address,
                                        customer.addedBy,
                                        customer?.addedTime?.slice(0, 10),
                                        customer.updatedBy,
                                        customer?.updatedTime?.slice(0, 10),
                                        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <EditButton />
                                            <DeleteButton
                                                deleteApiLink="/customers/"
                                                itemId={customer._id}
                                                name={customer.name}
                                                onSuccess={() => setRefreshTrigger(n => n + 1)}
                                            />
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