import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DefaultNavbar from '../components/DefaultNavbar';
import Footer from '../components/Footer';
import { AiFillStar } from 'react-icons/ai';
import { FaReact, FaNodeJs, FaLongArrowAltRight } from 'react-icons/fa';
import { SiMongodb } from 'react-icons/si';
import { MdSecurity, MdInventory, MdDashboard } from 'react-icons/md';
import { FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi';

const features = [
    { id: 1, icon: <MdDashboard />, title: 'Smart Dashboard', description: 'Real-time analytics, stat cards, and charts at a glance.' },
    { id: 2, icon: <MdInventory />, title: 'Dual Inventory', description: 'Separate tracks for main products and auxiliary supply items.' },
    { id: 3, icon: <SiMongodb />, title: 'MongoDB Database', description: 'Modern, flexible, and blazing-fast data storage.' },
    { id: 4, icon: <FaNodeJs />, title: 'Node.js Backend', description: 'High-performance REST API for all operations.' },
    { id: 5, icon: <FaReact />, title: 'React Frontend', description: 'Smooth, reactive UI with zero page refreshes.' },
    { id: 6, icon: <MdSecurity />, title: 'Secure by Design', description: 'Firebase auth with role-based access control.' },
];

const reviews = [
    {
        id: 1, title: 'Business Type: Wholesale',
        description: "Inventory Management System's Shopify integration is saving tons of time — no more manual product uploads.",
        reviewer: 'Lighting & Decor'
    },
    {
        id: 2, title: 'Business Type: Multichannel',
        description: 'I can be on holiday and still log in to see exactly what\'s happening. The dashboard gives me everything I need.',
        reviewer: 'WorkWear'
    },
    {
        id: 3, title: 'Business Type: Multichannel Retail',
        description: 'Cost-effective, super-efficient, and ready to implement in minimal time. Very happy with it.',
        reviewer: 'Sand Dollar'
    },
];

const faqs = [
    {
        id: 1, title: 'What does the Inventory Module include?',
        description: 'Covers all stock management processes — products, services, assets, price lists, stock adjustments, transfers, write-offs and more.'
    },
    {
        id: 2, title: 'Can I see real-time inventory updates?',
        description: 'Yes. The Product Availability Report shows exact quantities: on-hand, available, on-order, and allocated — all live.'
    },
    {
        id: 3, title: 'What is the purpose of stock adjustments?',
        description: 'Adjustments let you correct quantity and price for new stock entries, damaged/stolen goods, or data entry errors.'
    },
];

export default function Home() {
    const [openFaq, setOpenFaq] = useState(null);

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

            {/* ── Features ─────────────────────────────── */}
            <section style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
                        Designed for simplicity and speed.
                    </h2>
                    <p style={{ color: '#94a3b8', maxWidth: 480, margin: '12px auto 0', lineHeight: 1.7, fontSize: '0.95rem' }}>
                        Purpose-built for retail, wholesale, and warehousing businesses that need high efficiency, clean interfaces, and reliability.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                    {features.map(f => (
                        <div key={f.id} style={{
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid rgba(255,255,255,0.04)',
                            borderRadius: 12,
                            padding: '28px',
                            transition: 'all 0.25s ease',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(20,184,166,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.015)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                        >
                            <div style={{
                                width: 40, height: 40, borderRadius: 8,
                                background: 'rgba(255,255,255,0.03)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: '#94a3b8', fontSize: '1.2rem', marginBottom: 20,
                            }}>{f.icon}</div>
                            <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 10, color: '#ffffff' }}>{f.title}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ─────────────────────────── */}
            <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
                                Trusted by growing businesses.
                            </h2>
                            <p style={{ color: '#94a3b8', marginTop: 10, maxWidth: 440, lineHeight: 1.7, fontSize: '0.95rem' }}>
                                Learn why modern retail owners trust our minimal workflow interface.
                            </p>
                        </div>
                        <a href="#reviews" className="ims-btn" style={{
                            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#f1f5f9',
                            padding: '10px 20px', fontSize: '0.85rem', fontWeight: 600, borderRadius: 8,
                            display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                            Read Reviews
                            <FaLongArrowAltRight size={14} />
                        </a>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                        {reviews.map(r => (
                            <div key={r.id} style={{
                                background: '#0b0f19',
                                border: '1px solid rgba(255,255,255,0.04)',
                                borderRadius: 12,
                                padding: '28px',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                            }}>
                                <div>
                                    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                                        {[...Array(5)].map((_, i) => <AiFillStar key={i} style={{ color: '#f59e0b', fontSize: '0.9rem' }} />)}
                                    </div>
                                    <h4 style={{ fontWeight: 600, color: 'var(--teal)', marginBottom: 12, fontSize: '0.85rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{r.title}</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>"{r.description}"</p>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, fontWeight: 500 }}>
                                    {r.reviewer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ─────────────────────────────────── */}
            <section style={{ padding: '100px 24px', maxWidth: 760, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 52 }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>Frequently Asked Questions</h2>
                    <p style={{ color: '#94a3b8', marginTop: 12, lineHeight: 1.7, fontSize: '0.95rem' }}>
                        Have a question? Check here first. Can't find it? Reach out to support.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {faqs.map(faq => (
                        <div
                            key={faq.id}
                            style={{
                                background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)',
                                borderRadius: 8, overflow: 'hidden',
                                borderLeft: openFaq === faq.id ? '2px solid var(--teal)' : '2px solid transparent',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between', padding: '18px 20px',
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', textAlign: 'left',
                                    fontFamily: 'inherit',
                                }}
                            >
                                {faq.title}
                                {openFaq === faq.id
                                    ? <FiMinus style={{ color: 'var(--teal)', flexShrink: 0 }} />
                                    : <FiPlus style={{ color: '#64748b', flexShrink: 0 }} />
                                }
                            </button>
                            {openFaq === faq.id && (
                                <div style={{ padding: '0 20px 18px', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.7 }}>
                                    {faq.description}
                                </div>
                            )}
                        </div>
                    ))}
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