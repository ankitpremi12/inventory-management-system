import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const navLinks = [
    { id: 1, to: '/',         label: 'Home' },
    { id: 4, to: '/dashboard',label: 'Dashboard' },
];

const DefaultNavbar = ({ isLight = false }) => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navTextColor = isLight && !scrolled ? 'var(--text-secondary)' : '#94a3b8';
    const navHoverColor = isLight && !scrolled ? 'var(--text-primary)' : '#f1f5f9';
    const logoColor = isLight && !scrolled ? 'var(--text-primary)' : '#f1f5f9';

    return (
        <nav
            id="default-navbar"
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                background: scrolled ? (isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15,23,42,0.85)') : 'transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
                borderBottom: scrolled ? (isLight ? '1px solid var(--navy-border)' : '1px solid rgba(51,65,85,0.5)') : '1px solid transparent',
                transition: 'all 0.3s ease',
                padding: '0 24px',
                height: 68,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: 'linear-gradient(135deg,#0d9488,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#fff', fontSize: 15,
                }}>A</div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: logoColor, letterSpacing: '-0.01em' }}>
                    AP <span style={{ color: 'var(--teal)' }}>Solutions</span>
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
                                color: isActive ? 'var(--teal)' : navTextColor,
                                textDecoration: 'none',
                                background: isActive ? 'rgba(20,184,166,0.1)' : 'transparent',
                                transition: 'all 0.15s ease',
                                display: 'block',
                            })}
                            onMouseEnter={e => { if (!e.currentTarget.style.background.includes('rgba(20,184,166,0.1)')) e.currentTarget.style.color = navHoverColor; }}
                            onMouseLeave={e => { if (!e.currentTarget.style.background.includes('rgba(20,184,166,0.1)')) e.currentTarget.style.color = navTextColor; }}
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* CTA + mobile toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link
                    to="/dashboard"
                    className="hidden lg:inline-flex ims-btn ims-btn-teal"
                    style={{ padding: '8px 20px' }}
                >
                    Get Started
                </Link>
                <button
                    className="lg:hidden ims-btn ims-btn-ghost ims-btn-icon"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                    style={{ color: logoColor }}
                >
                    {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div style={{
                    position: 'absolute', top: 68, left: 0, right: 0,
                    background: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15,23,42,0.97)',
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
                                        color: isActive ? 'var(--teal)' : (isLight ? 'var(--text-secondary)' : '#94a3b8'),
                                        textDecoration: 'none',
                                        background: isActive ? 'rgba(20,184,166,0.1)' : 'transparent',
                                    })}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                        <li style={{ marginTop: 12 }}>
                            <Link
                                to="/dashboard"
                                onClick={() => setOpen(false)}
                                className="ims-btn ims-btn-teal"
                                style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                            >
                                Get Started
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default DefaultNavbar;