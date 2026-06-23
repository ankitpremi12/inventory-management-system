import React from 'react';
import SaveButton from '../../../components/Buttons/SaveButton';
import CancelButton from '../../../components/Buttons/CancelButton';
import PrintButton from '../../../components/Buttons/PrintButton';
import NewButton from '../../../components/Buttons/NewButton';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import DoubleInput from '../../../components/form/DoubleInput';
import ModalCloseButton from '../../../components/Buttons/ModalCloseButton';
import ModalHeading from '../../../components/Headings/ModalHeading';
import { useState } from 'react';
import { useEffect } from 'react';
import RefreshButton from '../../../components/Buttons/RefreshButton';
import TableRow from '../../../components/TableRow';
import EditButton from '../../../components/Buttons/EditButton';
import DeleteButton from '../../../components/Buttons/DeleteButton';
import { toast } from 'react-toastify';
import DashboardPageHeading from '../../../components/Headings/DashboardPageHeading';
import AddModal from '../../../components/modals/AddModal';
import { fetchJson } from '../../../api';

const PurchasePharmacyProducts = () => {
    const tableHeadItems = ['SN', 'Voucher', 'Supplier', 'Status', 'Quantity', 'TP', 'Vat', 'Discount', 'MRP', 'Creator', 'Created at', 'Actions'];

    const modalTableHeadItems1 = ['SN', 'Name', 'Strength', 'Company', 'Category', 'Pack Type', 'TP'];

    const modalTableHeadItems2 = ['SN', 'Name', 'Strength', 'Category', 'Stock', 'Quantity', 'Total TP', 'Action'];

    const tableHead = <tr>
        {
            tableHeadItems?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    const modalTableHead1 = <tr>
        {
            modalTableHeadItems1?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    const modalTableHead2 = <tr>
        {
            modalTableHeadItems2?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    // add pharmacy order to db
    const addPharmacyOrder = event => {
        event.preventDefault();

        const supplier = event?.target?.supplier?.value; const tradeName = event?.target?.tradeName?.value;
        const category = event?.target?.category?.value;
        const strength = event?.target?.strength?.value;
        const boxType = event?.target?.boxType?.value;
        const unitType = event?.target?.unitType?.value;
        const creator = 'admin';
        const createdAt = new Date();

        const productDetails = { supplier, tradeName, category, strength, boxType, unitType, creator, createdAt };

        // send data to server
        fetchJson('/purchases/main', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(productDetails)
        })
            .then(res => res.json())
            .then(data => {
                toast(
                    <AddModal name='Order' />
                );
            });

        event.target.reset();
    };

    const [pharmacyProducts, setPharmacyProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);

    // get categories data
    useEffect(() => {
        fetchJson('/setup/categories')
            .then(c => setCategories(c));
    }, [categories]);

    // get unit types data
    useEffect(() => {
        fetchJson('/setup/unitTypes')
            .then(ut => setUnitTypes(ut));
    }, [unitTypes]);

    useEffect(() => {
        fetchJson('/purchases/main')
            .then(products => setPharmacyProducts(products));
    }, [pharmacyProducts]);

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Main Stock Purchases'
                value={pharmacyProducts.length}
                buttons={[
                    <NewButton modalId='create-new-product' />,
                    <RefreshButton />,
                    <PrintButton />
                ]}
            />

            {/* create new pharmacy product purchase */}
            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer z-50">
                <label className="modal-box lg:w-10/12 md:w-11/12 w-full max-w-5xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />

                    <ModalHeading modalHeading={'Create a Main Stock Purchase'} />

                    <form onSubmit={addPharmacyOrder}>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 mb-2'>
                            <Input title={'Trade Name'} type='text' placeholder='Trade name' name='tradeName' isRequired='required' />
                            <Select title={'Category'} name='category' isRequired='required' options={categories.map(c => c.name)} />

                            <Input title={'Strength'} type='text' placeholder='Strength' name='strength' isRequired='required' />

                            <Select title={'Box Type'} name='boxType' isRequired='required' />
                            <Select title={'Unit Type'} name='unitType' isRequired='required' options={unitTypes.map(u => u.name)} />
                        </div>

                        <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                            <div className="grid">
                                <table className="table table-zebra table-compact">
                                    <thead>
                                        {
                                            modalTableHead1
                                        }
                                    </thead>
                                    <tbody>
                                        {
                                            pharmacyProducts.map((product, index) =>
                                                <TableRow
                                                    key={product._id}
                                                    tableRowsData={
                                                        [
                                                            index + 1,
                                                            product.name,
                                                            product.strength,
                                                            product.company,
                                                            product.category,
                                                            product.packType,
                                                            product.Tp,
                                                        ]
                                                    } />)
                                        }
                                    </tbody>
                                </table>

                                <SaveButton extraClass={'mt-4'} />
                            </div>

                            <div className="divider lg:divider-horizontal"></div>

                            <div className="grid">

                                <table className="table table-zebra table-compact">
                                    <thead>
                                        {
                                            modalTableHead2
                                        }
                                    </thead>
                                    <tbody>
                                        {
                                            pharmacyProducts.map((product, index) =>
                                                <TableRow
                                                    key={product._id}
                                                    tableRowsData={
                                                        [
                                                            index + 1,
                                                            product.name,
                                                            product.strength,
                                                            product.category,
                                                            product.stock,
                                                            product.quantity,
                                                            product.totalTp,
                                                            <span className='flex items-center gap-x-1'>
                                                                <EditButton />
                                                                <DeleteButton
                                                                    deleteApiLink='/orders/pharmacy/'
                                                                    itemId={'pharmacyOrder._id'} />
                                                            </span>
                                                        ]
                                                    } />)
                                        }
                                    </tbody>
                                </table>

                                <CancelButton extraClass={'mt-4'} />
                            </div>
                        </div>
                    </form>
                </label>
            </label>

            {/* update a pharmacy product */}
            <input type="checkbox" id="update-pharmacy-product" className="modal-toggle" />
            <label htmlFor="update-pharmacy-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'update-pharmacy-product'} />

                    <ModalHeading modalHeading={'Update a Product'} />

                    <form>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 mb-2'>
                            <Input title={'Trade Name'} name='tradeName' />
                            <Input title={'Generic Name'} name='genericName' />
                            <Input title={'Strength'} name='strength' />

                            <Select title={'Category'} />
                            <Input title={'Company'} type='text' placeholder='Company name' name='company' />
                        </div>

                        <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                            <div className="grid">
                                <h3 className='text-xl'>Purchase Area</h3>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Select title={'Purchase Unit Type'} />
                                    <Input title={'Pack Size'} name='packSize' />
                                </div>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Pack TP'} name='packTp' />
                                    <Input title={'Unit TP'} name='unitTp' />
                                </div>

                                <DoubleInput title={'Purchase VAT'} />
                                <DoubleInput title={'Purchase Discount'} />

                                <SaveButton extraClass='mt-4' />
                            </div>

                            <div className="divider lg:divider-horizontal"></div>

                            <div className="grid">
                                <h3 className='text-xl'>Sale Area</h3>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Select title={'Sales Unit Type'} />
                                    <Input title={'Pack Size'} />
                                </div>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Pack MRP'} />
                                    <Input title={'Unit MRP'} />
                                </div>

                                <DoubleInput title={'Sales VAT'} />
                                <DoubleInput title={'Sales Discount'} />

                                <CancelButton extraClass='mt-4' />
                            </div>
                        </div>
                    </form>
                </label>
            </label>

            {/* Purchased Table */}
            <table className="table table-zebra table-compact">
                <thead>
                    {
                        tableHead
                    }
                </thead>
                <tbody>
                    {
                        pharmacyProducts.map((product, index) =>
                            <TableRow
                                key={product._id}
                                tableRowsData={
                                    [
                                        index + 1,
                                        product.genericName,
                                        product.tradeName,
                                        product.category,
                                        product.strength,
                                        product.company,
                                        product.stock,
                                        product.packType,
                                        product.salePackSize,
                                        product.packTp,
                                        product.packMrp,
                                        product.unitTp,
                                        product.unitMrp,
                                        product.addedBy,
                                        product?.addedToDbAt?.slice(0, 10),
                                        <span className='flex items-center gap-x-1'>
                                            <EditButton />
                                            <DeleteButton
                                                deleteApiLink='/purchases/main/'
                                                itemId={product._id}
                                                name={product.tradeName} />
                                        </span>
                                    ]
                                } />)
                    }
                </tbody>
            </table>
        </section >
    );
};

export default PurchasePharmacyProducts;