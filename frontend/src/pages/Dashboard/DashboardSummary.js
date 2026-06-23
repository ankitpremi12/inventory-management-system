import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchJson } from '../../api';

const InfoCard = ({ name, status, color }) => (
    <div style={{
        background: '#ffffff',
        border: '1px solid var(--navy-border)',
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        boxShadow: '0 2px 6px rgba(15,40,60,0.02)',
        animation: 'fadeIn 0.3s ease-out'
    }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{name}</span>
        <span style={{ fontSize: '1.75rem', fontWeight: 800, color: color || 'var(--text-primary)' }}>{status}</span>
    </div>
);

const DashboardSummary = () => {
    const [summary, setSummary] = useState({
        total_products: '—',
        total_customers: '—',
        total_orders: '—',
        low_stock_products: []
    });
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        setLoading(true);
        fetchJson('/dashboard/summary')
            .then(data => {
                if (data) {
                    setSummary(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading dashboard summary:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    const cards = [
        { name: 'Total Products', status: summary.total_products, color: 'var(--text-primary)' },
        { name: 'Total Customers', status: summary.total_customers, color: 'var(--violet)' },
        { name: 'Total Orders', status: summary.total_orders, color: 'var(--teal)' },
    ];

    // Build chart data
    const pieData = [
        { name: 'Total Products', value: typeof summary.total_products === 'number' ? summary.total_products : 0, color: '#3b82f6' },
        { name: 'Total Customers', value: typeof summary.total_customers === 'number' ? summary.total_customers : 0, color: '#8b5cf6' },
        { name: 'Total Orders', value: typeof summary.total_orders === 'number' ? summary.total_orders : 0, color: '#10b981' }
    ].filter(d => d.value > 0);

    const hasAnyData = pieData.length > 0;

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Dashboard Overview</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Real-time inventory & sales snapshot</p>
                </div>
            </div>

            {/* Stat cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
                {cards.map((card, i) => (
                    <InfoCard key={i} name={card.name} status={card.status} color={card.color} />
                ))}
            </div>

            {/* Charts & Low Stock Split */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 32 }}
                 className="grid-cols-1 lg:grid-cols-[2fr_1fr]">

                {/* Low Stock Warning Table */}
                <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, border: '1px solid var(--navy-border)', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                            Low Stock Warnings
                        </h3>
                        <span style={{ fontSize: '0.75rem', background: '#fef2f2', color: '#b91c1c', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                            Stock &le; 10
                        </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--navy-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '8px 4px', color: 'var(--text-secondary)' }}>Product Name</th>
                                    <th style={{ padding: '8px 4px', color: 'var(--text-secondary)' }}>SKU</th>
                                    <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', textAlign: 'center' }}>Stock Left</th>
                                    <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', textAlign: 'right' }}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                                            Checking stock levels...
                                        </td>
                                    </tr>
                                ) : summary.low_stock_products.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'green', fontWeight: 600 }}>
                                            &check; All products are sufficiently stocked.
                                        </td>
                                    </tr>
                                ) : (
                                    summary.low_stock_products.map((p) => (
                                        <tr key={p.id} style={{ borderBottom: '1px dotted var(--navy-border)' }}>
                                            <td style={{ padding: '10px 4px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                                            <td style={{ padding: '10px 4px', fontFamily: 'monospace' }}>{p.sku}</td>
                                            <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                                                <span style={{
                                                    background: p.quantity === 0 ? '#fee2e2' : '#fef3c7',
                                                    color: p.quantity === 0 ? '#991b1b' : '#92400e',
                                                    padding: '2px 6px', borderRadius: 4, fontWeight: 800
                                                }}>
                                                    {p.quantity}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 4px', textAlign: 'right', fontWeight: 600 }}>₹{p.price.toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Product Mix Pie Chart */}
                <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, border: '1px solid var(--navy-border)', padding: 20 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
                        System Overview Mix
                    </h3>
                    {hasAnyData && !loading ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={pieData} dataKey="value" cx="50%" cy="50%"
                                        innerRadius={45} outerRadius={65} paddingAngle={3}
                                    >
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: '#ffffff', border: '1px solid var(--navy-border)',
                                            borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-primary)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Legend */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                                {pieData.map((d, i) => (
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
                            height: 180, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 8,
                            color: 'var(--text-muted)'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 12l4.24-4.24" />
                            </svg>
                            <p style={{ fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>No record database entries found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardSummary;