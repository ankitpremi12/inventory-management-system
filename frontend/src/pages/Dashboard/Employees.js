import React, { useEffect, useState } from 'react';
import PrintButton from '../../components/Buttons/PrintButton';
import Input from '../../components/form/Input';
import TableRow from '../../components/TableRow';
import SaveButton from '../../components/Buttons/SaveButton';
import EditButton from '../../components/Buttons/EditButton';
import DeleteButton from '../../components/Buttons/DeleteButton';
import RefreshButton from '../../components/Buttons/RefreshButton';
import DashboardPageHeading from '../../components/Headings/DashboardPageHeading';
import { toast } from 'react-toastify';
import CancelButton from '../../components/Buttons/CancelButton';
import ModalHeading from '../../components/Headings/ModalHeading';
import ModalCloseButton from '../../components/Buttons/ModalCloseButton';
import NewButton from '../../components/Buttons/NewButton';
import AddModal from '../../components/modals/AddModal';
import { fetchJson } from '../../api';

const Employees = () => {
    const tableHeadItems = ['#', 'Name', 'Phone', 'Website', 'Email', 'Address', 'Creator', 'Created At', 'Updated By', 'Updated At', 'Actions'];
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEmployees = () => {
        setLoading(true);
        fetchJson('/employees')
            .then(data => { setEmployees(data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchEmployees(); }, []);

    const addEmployee = event => {
        event.preventDefault();
        const name     = event?.target?.employeeName?.value;
        const phone    = event?.target?.employeePhone?.value;
        const website  = event?.target?.employeeWebsite?.value;
        const email    = event?.target?.employeeEmail?.value;
        const address  = event?.target?.employeeAddress?.value;
        const addedBy  = 'admin';
        const addedTime    = new Date();
        const updatedBy    = 'admin';
        const updatedTime  = new Date();

        fetchJson('/employees', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name, phone, website, email, address, addedBy, addedTime, updatedBy, updatedTime }),
        })
            .then(() => {
                toast(<AddModal name={name} />);
                fetchEmployees();
                document.getElementById('create-new-employee').checked = false;
            });
    };

    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <DashboardPageHeading
                name="Employees"
                value={employees.length}
                buttons={[
                    <NewButton modalId="create-new-employee" />,
                    <RefreshButton />,
                    <PrintButton />,
                ]}
            />

            <input type="checkbox" id="create-new-employee" className="modal-toggle" />
            <label htmlFor="create-new-employee" className="modal cursor-pointer">
                <label className="ims-modal-box modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-2xl relative" htmlFor="">
                    <ModalCloseButton modalId="create-new-employee" />
                    <ModalHeading modalHeading="Add a new Employee" />
                    <form onSubmit={addEmployee}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '12px 16px', marginBottom: 20 }}>
                            <Input title="Employee Name"    name="employeeName"    isRequired="required" type="text" />
                            <Input title="Employee Phone"   name="employeePhone"   isRequired="required" type="text" />
                            <Input title="Employee Website" name="employeeWebsite" type="text" />
                            <Input title="Employee Email"   name="employeeEmail"   isRequired="required" type="email" />
                            <Input title="Employee Address" name="employeeAddress" isRequired="required" type="text" />
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <CancelButton />
                            <SaveButton />
                        </div>
                    </form>
                </label>
            </label>

            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--navy-border)', marginTop: 8 }}>
                <table className="ims-table" style={{ minWidth: 900 }}>
                    <thead>
                        <tr>{tableHeadItems.map((h, i) => <th key={i}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={11} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading…</td></tr>
                        ) : employees.length === 0 ? (
                            <tr><td colSpan={11} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No employees found.</td></tr>
                        ) : (
                            employees.map((employee, index) => (
                                <TableRow
                                    key={employee.id}
                                    tableRowsData={[
                                        index + 1,
                                        employee.name,
                                        employee.phone,
                                        employee.website,
                                        employee.email,
                                        employee.address,
                                        employee.addedBy,
                                        employee?.addedTime?.slice(0, 10),
                                        employee.updatedBy,
                                        employee?.updatedTime?.slice(0, 10),
                                        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <EditButton />
                                            <DeleteButton
                                                deleteApiLink="/employees/"
                                                itemId={employee.id}
                                                name={employee.name}
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

export default Employees;