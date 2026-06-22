import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { RiSettings5Fill, RiProfileLine, RiLogoutBoxRFill } from 'react-icons/ri';

const navLinks = [
    { id: 1, to: '/home',     label: 'Home' },
    { id: 2, to: '/dashboard',label: 'Dashboard' },
    { id: 3, to: '/profile',  label: 'Profile' },
    { id: 4, to: '/settings', label: 'Settings' },
];

const UserNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            id="user-navbar"
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                background: scrolled ? 'rgba(15,23,42,0.85)' : 'rgba(15,23,42,0.4)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(51,65,85,0.5)',
                transition: 'all 0.3s ease',
                padding: '0 24px',
                height: 68,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            {/* Logo */}
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: 'linear-gradient(135deg,#0d9488,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#fff', fontSize: 15,
                }}>S</div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                    String <span style={{ color: 'var(--teal)' }}>LAB</span>
                </span>
            </Link>

            {/* Desktop links */}
            <ul style={{ display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}
                className="hidden lg:flex">
                {navLinks.map(link => (
                    <li key={link.id}>
                        <NavLink
                            to={link.to}
                            style={({ isActive }) => ({
                                padding: '6px 14px',
                                borderRadius: 8,
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: isActive ? 'var(--teal)' : '#94a3b8',
                                textDecoration: 'none',
                                background: isActive ? 'rgba(20,184,166,0.1)' : 'transparent',
                                transition: 'all 0.15s ease',
                                display: 'block',
                            })}
                            onMouseEnter={e => { if (!e.currentTarget.style.background.includes('rgba(20,184,166,0.1)')) e.currentTarget.style.color = '#f1f5f9'; }}
                            onMouseLeave={e => { if (!e.currentTarget.style.background.includes('rgba(20,184,166,0.1)')) e.currentTarget.style.color = '#94a3b8'; }}
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* User Dropdown + Mobile menu toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        className="flex items-center gap-2 cursor-pointer"
                        style={{ padding: '4px 8px', borderRadius: 10, transition: 'background 0.15s' }}
                    >
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                            alt="avatar"
                            style={{ width: 34, height: 34, borderRadius: '50%', background: '#1e293b', border: '2px solid var(--teal)' }}
                        />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content mt-2 p-1 rounded-xl w-48"
                        style={{
                            background: 'var(--navy-card)',
                            border: '1px solid var(--navy-border)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                    >
                        {[
                            { to: '/profile', icon: <RiProfileLine />, label: 'Profile' },
                            { to: '/settings', icon: <RiSettings5Fill />, label: 'Settings' },
                            { to: '/', icon: <RiLogoutBoxRFill />, label: 'Log Out', danger: true },
                        ].map(item => (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                                    style={{ color: item.danger ? 'var(--rose)' : 'var(--text-secondary)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    className="lg:hidden ims-btn ims-btn-ghost ims-btn-icon"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div style={{
                    position: 'absolute', top: 68, left: 0, right: 0,
                    background: 'rgba(15,23,42,0.97)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid var(--navy-border)',
                    padding: '16px 20px 20px',
                    animation: 'slideUp 0.2s ease-out',
                }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {navLinks.map(link => (
                            <li key={link.id}>
                                <NavLink
                                    to={link.to}
                                    onClick={() => setOpen(false)}
                                    style={({ isActive }) => ({
                                        display: 'block', padding: '10px 14px', borderRadius: 8,
                                        fontSize: '0.9rem', fontWeight: 500,
                                        color: isActive ? 'var(--teal)' : '#94a3b8',
                                        textDecoration: 'none',
                                        background: isActive ? 'rgba(20,184,166,0.1)' : 'transparent',
                                    })}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default UserNavbar;