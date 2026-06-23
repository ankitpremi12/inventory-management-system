import React, { useState, useEffect } from 'react';
import { BiEdit } from 'react-icons/bi';
import DoubleInput from '../form/DoubleInput';
import Input from '../form/Input';
import Select from '../form/Select';
import ModalHeading from '../Headings/ModalHeading';
import CancelButton from './CancelButton';
import ModalCloseButton from './ModalCloseButton';
import SaveButton from './SaveButton';
import { toast } from 'react-toastify';
import { fetchJson } from '../../api';

const EditButton = ({ id }) => {
    const [pharmacyProduct, setPharmacyProduct] = useState([]);

    useEffect(() => {
        if (id) {
            fetchJson(`/products/main/${id}`)
                .then(products => setPharmacyProduct(products));
        }
    }, [id]);

    const addNonPharmacyProduct = event => {
        event.preventDefault();

        const tradeName = event?.target?.tradeName?.value;
        const genericName = event?.target?.genericName?.value;
        const strength = event?.target?.strength?.value;
        const category = event?.target?.category?.value;
        const company = event?.target?.company?.value;
        const stock = event?.target?.stock?.value;
        const packType = event?.target?.packType?.value;
        const purchaseUnitType = event?.target?.purchaseUnitType?.value;
        const purchasePackSize = event?.target?.purchasePackSize?.value;
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

        // send data to server
        fetchJson('/products/main', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(productDetails)
        })
            .then(res => res.json())
            .then(data => {
                toast(
                    <div className="alert alert-success shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{tradeName} added successfully.</span>
                        </div>
                    </div>
                );
            });

        event.target.reset();
    };

    return (
        <div>
            {/* update a pharmacy product */}
            <input type="checkbox" id="update-pharmacy-product" className="modal-toggle" />
            <label htmlFor="update-pharmacy-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'update-pharmacy-product'} />

                    <ModalHeading modalHeading={'Update ' + pharmacyProduct.tradeName} />

                    <form onSubmit={addNonPharmacyProduct}>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 mb-2'>
                            <Input title={'Trade Name'} type='text' value={pharmacyProduct.tradeName} name='tradeName' isRequired='required' />
                            <Input title={'Generic Name'} type='text' value={pharmacyProduct.genericName} placeholder='Generic name' name='genericName' isRequired='required' />
                            <Input title={'Strength'} type='number' value={pharmacyProduct.strength} placeholder='Strength' name='strength' isRequired='required' />

                            <Input title={'Category'} type='text' value={pharmacyProduct.category} placeholder='Category name' name='category' isRequired='required' />
                            <Input title={'Company'} type='text' value={pharmacyProduct.company} placeholder='Company name' name='company' isRequired='required' />
                            <Input title={'Stock'} type='number' value={pharmacyProduct.stock} placeholder='Stock' name='stock' isRequired='required' />
                            <Select title={'Pack Type'} name='packType' isRequired='required' />
                        </div>

                        <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                            <div className="grid">
                                <h3 className='text-xl'>Purchase Area</h3>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Purchase Unit Type'} type='text' value={pharmacyProduct.purchaseUnitType} placeholder='Unit type' name='purchaseUnitType' isRequired='required' />
                                    <Input title={'Pack Size'} type='number' value={pharmacyProduct.purchasePackSize} placeholder='Pack size' name='packSize' isRequired='required' />
                                </div>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Pack TP'} type='number' value={pharmacyProduct.packTp} placeholder='Pack TP' name='packTp' isRequired='required' />
                                    <Input title={'Unit TP'} type='number' value={pharmacyProduct.unitTp} placeholder='Unit TP' name='unitTp' isRequired='required' />
                                </div>

                                <DoubleInput title={'Purchase VAT'} name1='purchaseVatPercent' name2='purchaseVatTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' value1={pharmacyProduct.purchaseVatPercent} value2={pharmacyProduct.purchaseVatTaka} />
                                <DoubleInput title={'Purchase Discount'} name1='purchaseDiscountPercent' name2='purchaseDiscountTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' value1={pharmacyProduct.purchaseDiscountPercent} value2={pharmacyProduct.purchaseDiscountTaka} />

                                <SaveButton extraClass={'mt-4'} />
                            </div>

                            <div className="divider lg:divider-horizontal"></div>

                            <div className="grid">
                                <h3 className='text-xl'>Sale Area</h3>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Sales Unit Type'} type='text' value={pharmacyProduct.salesUnitType} placeholder='Unit type' name='salesUnitType' isRequired='required' />
                                    <Input title={'Pack Size'} type='number' value={pharmacyProduct.salePackSize} name='salePackSize' placeholder='Pack size' isRequired='required' />
                                </div>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Pack MRP'} type='number' name='packMrp' value={pharmacyProduct.packMrp} placeholder='Pack MRP' isRequired='required' />
                                    <Input title={'Unit MRP'} type='number' value={pharmacyProduct.unitMrp} name='unitMrp' placeholder='Unit MRP' isRequired='required' />
                                </div>

                                <DoubleInput title={'Sales VAT'} name1='salesVatPercent' name2='salesVatTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' value1={pharmacyProduct.salesVatPercent} value2={pharmacyProduct.salesVatTaka} />
                                <DoubleInput title={'Sales Discount'} name1='salesDiscountPercent' name2='salesDiscountTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' value1={pharmacyProduct.salesDiscountPercent} value2={pharmacyProduct.salesDiscountTaka} />

                                <CancelButton extraClass={'mt-4'} />
                            </div>
                        </div>
                    </form>
                </label>
            </label>


            <label
                htmlFor='update-pharmacy-product'
                className="modal-button"
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 7,
                    background: 'rgba(99,102,241,0.12)',
                    color: '#818cf8',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
                <BiEdit size={14} />
            </label>
        </div>
    );
};

export default EditButton;