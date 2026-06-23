import React from 'react';
import { Link } from 'react-router-dom';
import DefaultNavbar from '../components/DefaultNavbar';
import Footer from '../components/Footer';
import { FiArrowRight } from 'react-icons/fi';

export default function Home() {
    return (
        <div style={{ background: '#0b0f19', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <DefaultNavbar />

            {/* ── Hero ──────────────────────────────────── */}
            <section style={{
                minHeight: '85vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
                padding: '140px 24px 80px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ maxWidth: 800, animation: 'slideUp 0.6s ease-out', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 99, padding: '6px 16px', marginBottom: 28,
                        fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500,
                        letterSpacing: '0.05em', textTransform: 'uppercase'
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', boxShadow: '0 0 6px var(--teal)' }} />
                        Global Inventory Management
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.4rem, 6.5vw, 4.2rem)',
                        fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
                        letterSpacing: '-0.03em', color: '#ffffff'
                    }}>
                        Inventory management built for precision.
                    </h1>

                    <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 40px' }}>
                        Cloud-based software to manage products, stock, assets, orders, purchases, suppliers, and returns — all from a single minimal dashboard.
                    </p>

                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/dashboard" className="ims-btn" style={{
                            background: '#ffffff', color: '#0b0f19', border: '1px solid #ffffff',
                            padding: '12px 28px', fontSize: '0.9rem', fontWeight: 600,
                            borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: 8,
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
                        >
                            Go to Dashboard
                            <FiArrowRight size={15} />
                        </Link>
                        <Link to="/dashboard" className="ims-btn" style={{
                            background: 'transparent', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.15)',
                            padding: '12px 28px', fontSize: '0.9rem', fontWeight: 600,
                            borderRadius: '8px', transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                        >
                            View Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ─────────────────────────── */}
            <section style={{ padding: '40px 24px 100px' }}>
                <div style={{
                    maxWidth: 900, margin: '0 auto', textAlign: 'center',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: 16, padding: '60px 40px',
                }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: 16 }}>
                        Streamline your operations today.
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: 36, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 460, margin: '0 auto 36px' }}>
                        Join growing retail and wholesale business teams managing products, orders, and returns with precision.
                    </p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/dashboard" className="ims-btn" style={{
                            background: '#ffffff', color: '#0b0f19', border: '1px solid #ffffff',
                            padding: '12px 28px', fontSize: '0.9rem', fontWeight: 600,
                            borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: 8,
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
                        >
                            Go to Dashboard
                            <FiArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}