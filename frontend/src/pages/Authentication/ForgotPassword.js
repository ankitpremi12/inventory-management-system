import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import DefaultNavbar from '../../components/DefaultNavbar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 800);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
            <DefaultNavbar isLight={true} />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
                <div style={{
                    width: '100%', maxWidth: 400,
                    background: 'var(--navy-card)', border: '1px solid var(--navy-border)',
                    borderRadius: 20, padding: '40px 36px',
                    animation: 'slideUp 0.4s ease-out',
                }}>
                    {!sent ? (
                        <>
                            <div style={{
                                width: 52, height: 52, borderRadius: 14,
                                background: 'rgba(20,184,166,0.12)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: 'var(--teal)', marginBottom: 20,
                            }}>
                                <FiMail size={24} />
                            </div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Forgot password?</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 28 }}>
                                No worries. Enter your email and we'll send a reset link.
                            </p>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <div className="ims-input-wrap">
                                    <label className="ims-label">Email Address</label>
                                    <input
                                        type="email" placeholder="you@company.com" className="ims-input"
                                        value={email} onChange={e => setEmail(e.target.value)} required
                                    />
                                </div>
                                <button type="submit" disabled={loading} style={{
                                    background: 'linear-gradient(135deg,#0d9488,#14b8a6)',
                                    color: '#fff', border: 'none', borderRadius: 10,
                                    padding: '11px', fontSize: '0.9rem', fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                                    fontFamily: 'inherit', transition: 'opacity 0.2s',
                                }}>
                                    {loading ? 'Sending…' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 60, height: 60, borderRadius: '50%',
                                    background: 'rgba(16,185,129,0.12)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: '#10b981', margin: '0 auto 20px',
                                }}>
                                    <FiMail size={26} />
                                </div>
                                <h2 style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: 10 }}>Check your inbox</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                    We sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                                </p>
                            </div>
                        </>
                    )}

                    <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--navy-border)', textAlign: 'center' }}>
                        <Link to="/login" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            color: 'var(--text-muted)', textDecoration: 'none',
                            fontSize: '0.825rem', fontWeight: 500,
                        }}>
                            <FiArrowLeft size={14} /> Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;