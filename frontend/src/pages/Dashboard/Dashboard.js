import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
    MdSpaceDashboard, MdMenu, MdClose, MdInventory, MdAnalytics,
    MdOutlineCategory, MdBusiness, MdMedicalServices
} from 'react-icons/md';
import { RiShoppingCartFill, RiSettings5Fill, RiLogoutBoxRFill, RiProfileLine } from 'react-icons/ri';
import {
    FiMessageSquare, FiUsers, FiPackage, FiArrowLeftCircle,
    FiFileText, FiDollarSign, FiTruck, FiChevronDown, FiChevronRight,
    FiBriefcase, FiRepeat, FiShoppingBag, FiAlertCircle
} from 'react-icons/fi';
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

const SectionLabel = ({ label }) => (
    <div style={{
        fontSize: '0.6rem',
        fontWeight: 800,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
        padding: '12px 12px 4px',
        marginTop: 4,
    }}>
        {label}
    </div>
);

const CollapsibleSection = ({ label, icon, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
                <span style={{ fontSize: '0.75rem' }}>
                    {open ? <FiChevronDown /> : <FiChevronRight />}
                </span>
            </button>
            {open && (
                <div style={{ paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                    {children}
                </div>
            )}
        </div>
    );
};

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
            <aside className={`ims-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ overflowY: 'auto' }}>
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

                    {/* ── Overview ── */}
                    <SectionLabel label="Overview" />
                    <LinkComponents to={''} icon={<MdSpaceDashboard />} name={'Dashboard'} />
                    <LinkComponents to={'analytics'} icon={<MdAnalytics />} name={'Analytics'} />

                    {/* ── Inventory ── */}
                    <SectionLabel label="Inventory" />
                    <CollapsibleSection label="Products" icon={<MdInventory />} defaultOpen={true}>
                        <LinkComponents to={'products'} icon={<FiPackage />} name={'General Stock'} />
                        <LinkComponents to={'pharmacy-products'} icon={<MdMedicalServices />} name={'Pharmacy Stock'} />
                        <LinkComponents to={'non-pharmacy-products'} icon={<FiPackage />} name={'Supplies Stock'} />
                    </CollapsibleSection>

                    <CollapsibleSection label="Purchase" icon={<FiShoppingBag />}>
                        <LinkComponents to={'purchase-pharmacy'} icon={<MdMedicalServices />} name={'Pharmacy Purchase'} />
                        <LinkComponents to={'purchase-non-pharmacy'} icon={<FiPackage />} name={'Supplies Purchase'} />
                    </CollapsibleSection>

                    <CollapsibleSection label="Returns" icon={<FiRepeat />}>
                        <LinkComponents to={'returns-customers'} icon={<FiUsers />} name={'Customer Returns'} />
                        <LinkComponents to={'returns-expires-damages'} icon={<FiAlertCircle />} name={'Expires / Damages'} />
                    </CollapsibleSection>

                    <CollapsibleSection label="Requested Items" icon={<FiArrowLeftCircle />}>
                        <LinkComponents to={'requested-pharmacy'} icon={<MdMedicalServices />} name={'Pharmacy Items'} />
                        <LinkComponents to={'requested-non-pharmacy'} icon={<FiPackage />} name={'Supplies Items'} />
                    </CollapsibleSection>

                    {/* ── Sales ── */}
                    <SectionLabel label="Sales" />
                    <CollapsibleSection label="Orders" icon={<RiShoppingCartFill />} defaultOpen={true}>
                        <LinkComponents to={'orders'} icon={<FiFileText />} name={'General Orders'} />
                        <LinkComponents to={'pharmacy-orders'} icon={<MdMedicalServices />} name={'Pharmacy Orders'} />
                        <LinkComponents to={'non-pharmacy-orders'} icon={<FiPackage />} name={'Supplies Orders'} />
                    </CollapsibleSection>
                    <LinkComponents to={'customers'} icon={<FiUsers />} name={'Customers'} />

                    {/* ── Suppliers ── */}
                    <SectionLabel label="Suppliers" />
                    <CollapsibleSection label="Suppliers" icon={<FiTruck />}>
                        <LinkComponents to={'suppliers'} icon={<FiTruck />} name={'Supplier List'} />
                        <LinkComponents to={'suppliers-documents'} icon={<FiFileText />} name={'Documents'} />
                        <LinkComponents to={'suppliers-payments'} icon={<FiDollarSign />} name={'Payments'} />
                    </CollapsibleSection>

                    {/* ── HR ── */}
                    <SectionLabel label="HR" />
                    <LinkComponents to={'employees'} icon={<FiBriefcase />} name={'Employees'} />

                    {/* ── Configuration ── */}
                    <SectionLabel label="Setup" />
                    <CollapsibleSection label="Setup" icon={<RiSettings5Fill />}>
                        <LinkComponents to={'setup-categories'} icon={<MdOutlineCategory />} name={'Categories'} />
                        <LinkComponents to={'setup-companies'} icon={<MdBusiness />} name={'Companies'} />
                        <LinkComponents to={'setup-unit-types'} icon={<FiPackage />} name={'Unit Types'} />
                    </CollapsibleSection>

                    {/* Settings (bottom) */}
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
                                <li>
                                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,40,60,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <span className="text-base"><RiProfileLine /></span> Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,40,60,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <span className="text-base"><RiSettings5Fill /></span> Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150" style={{ color: 'var(--rose)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,40,60,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <span className="text-base"><RiLogoutBoxRFill /></span> Log Out
                                    </Link>
                                </li>
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