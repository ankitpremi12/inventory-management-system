import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FiCheckCircle } from 'react-icons/fi';

const features = [
    'Multi-category product and asset tracking',
    'Real-time dashboard with charts & KPIs',
    'Supplier management & payments',
    'Order and purchase history',
];

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = event => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 800);
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'var(--navy)', fontFamily: 'Inter, sans-serif',
        }}>
            {/* ── Left panel ─────────────────────────── */}
            <div style={{
                flex: '0 0 45%',
                background: 'linear-gradient(135deg,#0c1524 0%,#0f172a 50%,#11162b 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '60px 56px', position: 'relative', overflow: 'hidden',
            }} className="hidden lg:flex">
                {/* Blobs */}
                <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(20,184,166,0.15),transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%)', pointerEvents: 'none' }} />

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#0d9488,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 17 }}>A</div>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9' }}>AP <span style={{ color: 'var(--teal)' }}>Solutions</span></span>
                </div>

                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 16, color: '#f1f5f9' }}>
                    Manage your inventory<br />
                    <span style={{ background: 'linear-gradient(135deg,var(--teal),var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        with confidence.
                    </span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, fontSize: '0.95rem' }}>
                    The all-in-one platform for modern retail and wholesale inventory management.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <FiCheckCircle style={{ color: 'var(--teal)', flexShrink: 0 }} size={18} />
                            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right panel (form) ──────────────────── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
                {/* Mobile logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }} className="lg:hidden">
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#0d9488,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15 }}>A</div>
                    <span style={{ fontWeight: 700, color: '#f1f5f9' }}>AP <span style={{ color: 'var(--teal)' }}>Solutions</span></span>
                </div>

                <div style={{ width: '100%', maxWidth: 420 }}>
                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Welcome back</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to access your inventory</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="ims-input-wrap">
                            <label className="ims-label" htmlFor="login-email">Email Address</label>
                            <input
                                id="login-email"
                                type="email" placeholder="you@company.com"
                                className="ims-input"
                                value={email} onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="ims-input-wrap">
                            <label className="ims-label" htmlFor="login-password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="login-password"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="ims-input"
                                    style={{ paddingRight: 44 }}
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0,
                                    }}
                                >
                                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <input type="checkbox" style={{ accentColor: 'var(--teal)' }} />
                                Remember me
                            </label>
                            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--teal)', textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(135deg,#0d9488,#14b8a6)',
                                color: '#fff', border: 'none', borderRadius: 10,
                                padding: '12px', fontSize: '0.95rem', fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                opacity: loading ? 0.7 : 1,
                                transition: 'opacity 0.2s',
                                fontFamily: 'inherit',
                            }}
                        >
                            {loading ? 'Signing in…' : <>Sign In <FiArrowRight size={16} /></>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 28, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;