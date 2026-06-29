import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MdSpaceDashboard, MdMenu, MdClose, MdInventory, MdAnalytics } from 'react-icons/md';
import { RiShoppingCartFill, RiSettings5Fill, RiLogoutBoxRFill, RiProfileLine } from 'react-icons/ri';
import { FiMessageSquare, FiUsers } from 'react-icons/fi';
import LinkComponents from '../../components/navbar/LinkComponents';

const CubeLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top face */}
        <path d="M12 2.5L20.5 7L12 11.5L3.5 7L12 2.5Z" fill="#ebdcd0" stroke="#0f283c" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Left face */}
        <path d="M3.5 7V16.5L12 21V11.5L3.5 7Z" fill="#0f283c" stroke="#0f283c" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Right face */}
        <path d="M12 11.5V21L20.5 16.5V7L12 11.5Z" fill="#1e3a8a" stroke="#0f283c" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen" style={{ background: 'var(--navy)' }}>

            {/* ── Mobile overlay ───────────────────────── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ──────────────────────────────── */}
            <aside className={`ims-sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div className="flex items-center justify-center py-6 border-b border-white/5">
                    <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(15, 40, 60, 0.05)',
                        flexShrink: 0,
                    }}>
                        <CubeLogo />
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                    <LinkComponents to={''} icon={<MdSpaceDashboard />} name={'Dashboard'} />
                    <LinkComponents to={'products'} icon={<MdInventory />} name={'Products'} />
                    <LinkComponents to={'customers'} icon={<FiUsers />} name={'Customers'} />
                    <LinkComponents to={'orders'} icon={<RiShoppingCartFill />} name={'Orders'} />
                    <LinkComponents to={'analytics'} icon={<MdAnalytics />} name={'Analytics'} />

                    {/* Spacer to push Settings & Logout to the bottom */}
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                        <LinkComponents to={'/settings'} icon={<RiSettings5Fill />} name={'Settings'} />
                    </div>
                </nav>
            </aside>

            {/* ── Main area ─────────────────────────── */}
            <div className="ims-content flex-1">
                {/* Top bar */}
                <header className="ims-topbar justify-between" style={{ background: 'var(--navy-card)', borderBottom: '1px solid var(--navy-border)' }}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden ims-btn ims-btn-ghost ims-btn-icon"
                        >
                            {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                            AP Solutions Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-4" style={{ flexWrap: 'nowrap' }}>
                        {/* Chat icon */}
                        <button className="ims-btn ims-btn-ghost ims-btn-icon relative" style={{ color: 'var(--text-primary)', background: 'transparent', borderColor: 'transparent' }}>
                            <FiMessageSquare size={18} />
                        </button>


                        {/* User Profile dropdown */}
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                className="flex items-center gap-2 cursor-pointer"
                                style={{
                                    width: 34, height: 34, borderRadius: '50%',
                                    background: '#ebdcd0', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                                    alt="avatar"
                                    style={{ width: 34, height: 34, borderRadius: '50%' }}
                                />
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content mt-2 p-1 rounded-xl w-48"
                                style={{
                                    background: 'var(--navy-card)',
                                    border: '1px solid var(--navy-border)',
                                    boxShadow: '0 8px 32px rgba(15,40,60,0.1)',
                                }}
                            >
                                {[
                                    { to: '/profile', icon: <RiProfileLine />, label: 'Profile' },
                                    { to: '/settings', icon: <RiSettings5Fill />, label: 'Settings' },
                                    { to: '/', icon: <RiLogoutBoxRFill />, label: 'Log Out', danger: true },
                                ].map((item, idx) => (
                                    <li key={idx}>
                                        <Link
                                            to={item.to}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                                            style={{ color: item.danger ? 'var(--rose)' : 'var(--text-secondary)' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,40,60,0.05)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span className="text-base">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;