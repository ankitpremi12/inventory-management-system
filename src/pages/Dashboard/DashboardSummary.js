import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import PrintButton from '../../components/Buttons/PrintButton';
import RefreshButton from '../../components/Buttons/RefreshButton';
import InfoCard from '../../components/InfoCard';
import { fetchJson } from '../../api';


const DashboardSummary = () => {
    const [pharmacyProducts, setPharmacyProducts] = useState('—');
    const [nonPharmacyProducts, setNonPharmacyProducts] = useState('—');
    const [pharmacyRequestedItems, setPharmacyRequestedItems] = useState('—');
    const [nonPharmacyRequestedItems, setNonPharmacyRequestedItems] = useState('—');
    const [pharmacyOrders, setPharmacyOrders] = useState('—');
    const [nonPharmacyOrders, setNonPharmacyOrders] = useState('—');
    const [pharmacyPurchases, setPharmacyPurchases] = useState('—');
    const [nonPharmacyPurchases, setNonPharmacyPurchases] = useState('—');
    const [returnsCustomers, setReturnsCustomers] = useState('—');
    const [returnsExpiresOrDamages, setReturnsExpiresOrDamages] = useState('—');
    const [categories, setCategories] = useState('—');
    const [unitTypes, setUnitTypes] = useState('—');
    const [companies, setCompanies] = useState('—');
    const [employees, setEmployees] = useState('—');
    const [customers, setCustomers] = useState('—');
    const [suppliersLists, setSuppliersLists] = useState('—');
    const [suppliersPayments, setSuppliersPayments] = useState('—');
    const [suppliersDocuments, setSuppliersDocuments] = useState('—');


    useEffect(() => {
        const fetches = [
            ['/products/main',           setPharmacyProducts],
            ['/products/supplies',        setNonPharmacyProducts],
            ['/requestedItems/main',     setPharmacyRequestedItems],
            ['/requestedItems/supplies',  setNonPharmacyRequestedItems],
            ['/orders/main',             setPharmacyOrders],
            ['/orders/supplies',          setNonPharmacyOrders],
            ['/purchases/main',          setPharmacyPurchases],
            ['/purchases/supplies',       setNonPharmacyPurchases],
            ['/returns/customers',           setReturnsCustomers],
            ['/returns/expiresOrDamages',    setReturnsExpiresOrDamages],
            ['/setup/categories',            setCategories],
            ['/setup/unitTypes',             setUnitTypes],
            ['/setup/companies',             setCompanies],
            ['/employees',                   setEmployees],
            ['/customers',                   setCustomers],
            ['/suppliers/lists',             setSuppliersLists],
            ['/suppliers/payments',          setSuppliersPayments],
            ['/suppliers/documents',         setSuppliersDocuments],
        ];
        fetches.forEach(([path, setter]) => {
            fetchJson(path)
                .then(data => setter(Array.isArray(data) ? data.length : 0))
                .catch(() => setter(0));
        });
    }, []);

    const cards = [
        { name: 'Main Stock Products',       status: pharmacyProducts },
        { name: 'Supplies Products',         status: nonPharmacyProducts },
        { name: 'Requested (Main Stock)',    status: pharmacyRequestedItems },
        { name: 'Requested (Supplies)',      status: nonPharmacyRequestedItems },
        { name: 'Orders (Main Stock)',       status: pharmacyOrders },
        { name: 'Orders (Supplies)',         status: nonPharmacyOrders },
        { name: 'Purchases (Main Stock)',    status: pharmacyPurchases },
        { name: 'Purchases (Supplies)',      status: nonPharmacyPurchases },
        { name: 'Customer Returns',           status: returnsCustomers },
        { name: 'Expires / Damages',          status: returnsExpiresOrDamages },
        { name: 'Categories',                 status: categories },
        { name: 'Unit Types',                 status: unitTypes },
        { name: 'Companies',                  status: companies },
        { name: 'Employees',                  status: employees },
        { name: 'Customers',                  status: customers },
        { name: 'Supplier Lists',             status: suppliersLists },
        { name: 'Supplier Payments',          status: suppliersPayments },
        { name: 'Supplier Documents',         status: suppliersDocuments },
    ];

    // Build pie data dynamically from real API counts
    const dynamicPieData = [
        { name: 'Main Stock',  value: typeof pharmacyProducts    === 'number' ? pharmacyProducts    : 0, color: '#0f283c' },
        { name: 'Supplies',    value: typeof nonPharmacyProducts === 'number' ? nonPharmacyProducts : 0, color: '#475569' },
        { name: 'Returns',     value: (typeof returnsCustomers === 'number' ? returnsCustomers : 0) + (typeof returnsExpiresOrDamages === 'number' ? returnsExpiresOrDamages : 0), color: '#b91c1c' },
        { name: 'Orders',      value: (typeof pharmacyOrders === 'number' ? pharmacyOrders : 0) + (typeof nonPharmacyOrders === 'number' ? nonPharmacyOrders : 0), color: '#b45309' },
    ].filter(d => d.value > 0);

    const hasAnyData = dynamicPieData.some(d => d.value > 0);

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Dashboard Overview</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Real-time inventory snapshot</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <RefreshButton />
                    <PrintButton />
                </div>
            </div>

            {/* Stat cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 14, marginBottom: 32 }}>
                {cards.map((card, i) => (
                    <InfoCard key={i} name={card.name} status={card.status} />
                ))}
            </div>

            {/* Charts section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 32 }}
                 className="grid-cols-1 lg:grid-cols-[2fr_1fr]">

                {/* Composed chart — only shown when there is real data */}
                <div className="ims-card">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                        Monthly Performance
                    </h3>
                    <div style={{
                        height: 280, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 12,
                        color: 'var(--text-muted)'
                    }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        <p style={{ fontSize: '0.85rem', margin: 0 }}>No transaction data yet</p>
                        <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)' }}>Charts will appear as you add orders and purchases</p>
                    </div>
                </div>

                {/* Pie chart — dynamic from real counts */}
                <div className="ims-card">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                        Product Mix
                    </h3>
                    {hasAnyData ? (
                        <>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={dynamicPieData} dataKey="value" cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={85} paddingAngle={3}
                                    >
                                        {dynamicPieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--navy-card)', border: '1px solid var(--navy-border)',
                                            borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-primary)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Legend */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                                {dynamicPieData.map((d, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.name}</span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{
                            height: 200, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 8,
                            color: 'var(--text-muted)'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 12l4.24-4.24" />
                            </svg>
                            <p style={{ fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>Add products to see the mix</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardSummary;