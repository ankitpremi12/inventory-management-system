import React, { useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { toast } from 'react-toastify';
import { fetchJson } from '../../api';

const AnalyticsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchJson('/dashboard/analytics')
            .then(res => {
                if (res) {
                    setData(res);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching analytics data:", err);
                toast.error("Failed to load analytics data: " + err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--text-secondary)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid var(--navy-border)', borderTopColor: 'var(--teal)', borderRadius: '50%', margin: '0 auto 16px' }} />
                    <p style={{ fontWeight: 600 }}>Loading visual profile...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                Failed to load analytics.
            </div>
        );
    }

    const { sales_over_time, top_products, stock_distribution, top_customers } = data;

    // Calculate metrics
    const totalRevenue = sales_over_time.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = sales_over_time.reduce((sum, item) => sum + item.orders, 0);
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
    const totalUnitsSold = top_products.reduce((sum, item) => sum + item.units_sold, 0);

    // Dynamic stock color mappings
    const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

    return (
        <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{
                    width: 38, height: 38, borderRadius: 8, background: 'var(--text-primary)',
                    color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <AnalyticsIcon />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        Data Profile & Visualization
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        Deep insights into sales, product velocities, and stock allocation distributions
                    </p>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                    { name: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, color: 'var(--teal)' },
                    { name: 'Total Orders', value: totalOrders, color: '#3b82f6' },
                    { name: 'Avg Order Value', value: `₹${averageOrderValue.toFixed(2)}`, color: '#8b5cf6' },
                    { name: 'Units Sold Velocity', value: totalUnitsSold, color: '#ec4899' },
                ].map((kpi, idx) => (
                    <div key={idx} className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {kpi.name}
                        </span>
                        <span style={{ fontSize: '1.75rem', fontWeight: 800, color: kpi.color }}>
                            {kpi.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Main Visualizations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }} className="grid-cols-1 lg:grid-cols-[2fr_1fr]">
                {/* Sales Chart Card */}
                <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
                        Sales Revenue Trend Over Time (₹)
                    </h3>
                    <div style={{ width: '100%', height: 280 }}>
                        {sales_over_time.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sales_over_time} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.25}/>
                                            <stop offset="95%" stopColor="var(--teal)" stopOpacity={0.01}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e3d9cd" />
                                    <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} />
                                    <YAxis stroke="var(--text-secondary)" fontSize={11} />
                                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--navy-border)', borderRadius: 8, fontSize: '0.8rem' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="var(--teal)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                No sales transactions data available yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Stock distribution donut chart */}
                <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
                        Stock Status Distribution
                    </h3>
                    <div style={{ width: '100%', height: 180, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {stock_distribution.reduce((acc, c) => acc + c.value, 0) > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stock_distribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {stock_distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--navy-border)', borderRadius: 8, fontSize: '0.8rem' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ color: 'var(--text-muted)' }}>No products in stock.</div>
                        )}
                    </div>
                    {/* Legend */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                        {stock_distribution.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[idx] }} />
                                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                                </div>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Second row of Visualizations */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="grid-cols-1 lg:grid-cols-2">
                {/* Product Sales Velocity Bar Chart */}
                <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
                        Top Selling Products by Volume
                    </h3>
                    <div style={{ width: '100%', height: 260 }}>
                        {top_products.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={top_products} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e3d9cd" />
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickFormatter={(t) => t.length > 12 ? t.substring(0, 10) + '..' : t} />
                                    <YAxis stroke="var(--text-secondary)" fontSize={11} />
                                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--navy-border)', borderRadius: 8, fontSize: '0.8rem' }} />
                                    <Bar dataKey="units_sold" fill="#8b5cf6" name="Units Sold" radius={[4, 4, 0, 0]}>
                                        {top_products.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--teal)' : '#8b5cf6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                No products sold yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer Value Leaderboard */}
                <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: 20 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
                        Top Value Customer Leaderboard
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--navy-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '8px 4px', color: 'var(--text-secondary)' }}>Rank</th>
                                    <th style={{ padding: '8px 4px', color: 'var(--text-secondary)' }}>Customer Name</th>
                                    <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', textAlign: 'center' }}>Orders Count</th>
                                    <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', textAlign: 'right' }}>Total Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top_customers.length > 0 ? (
                                    top_customers.map((c, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px dotted var(--navy-border)' }}>
                                            <td style={{ padding: '12px 4px', fontWeight: 700, color: 'var(--text-muted)' }}>#{idx + 1}</td>
                                            <td style={{ padding: '12px 4px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                                            <td style={{ padding: '12px 4px', textAlign: 'center' }}>{c.orders_count}</td>
                                            <td style={{ padding: '12px 4px', textAlign: 'right', fontWeight: 700, color: 'var(--teal)' }}>₹{c.total_spent.toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                                            No customer transactions recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Analytics;
