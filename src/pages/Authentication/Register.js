import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const Register = () => {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleRegister = event => {
        event.preventDefault();
        if (!agreed) return;
        setLoading(true);
        setTimeout(() => { setLoading(false); navigate('/login'); }, 800);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--navy)', fontFamily: 'Inter, sans-serif' }}>
            {/* Left panel */}
            <div style={{
                flex: '0 0 40%', background: 'linear-gradient(135deg,#0c1524,#0f172a)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '60px 52px', position: 'relative', overflow: 'hidden',
            }} className="hidden lg:flex">
                <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#0d9488,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16 }}>A</div>
                    <span style={{ fontWeight: 700, color: '#f1f5f9' }}>AP <span style={{ color: 'var(--teal)' }}>Solutions</span></span>
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 16, color: '#f1f5f9' }}>
                    Start your free<br />
                    <span style={{ background: 'linear-gradient(135deg,var(--teal),var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        inventory journey.
                    </span>
                </h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 36, fontSize: '0.9rem' }}>
                    Join hundreds of businesses already using AP Solutions to manage their stock, orders, and suppliers.
                </p>
                {['No credit card required', 'Full-featured free trial', 'Cancel anytime'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <FiCheckCircle style={{ color: 'var(--teal)', flexShrink: 0 }} size={16} />
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{t}</span>
                    </div>
                ))}
            </div>

            {/* Right panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
                <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#0d9488,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14 }}>A</div>
                    <span style={{ fontWeight: 700, color: '#f1f5f9' }}>AP <span style={{ color: 'var(--teal)' }}>Solutions</span></span>
                </div>

                <div style={{ width: '100%', maxWidth: 440 }}>
                    <div style={{ marginBottom: 28 }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>Create your account</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>It only takes a minute.</p>
                    </div>

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div className="ims-input-wrap">
                                <label className="ims-label">First Name</label>
                                <input type="text" placeholder="John" className="ims-input" required />
                            </div>
                            <div className="ims-input-wrap">
                                <label className="ims-label">Last Name</label>
                                <input type="text" placeholder="Doe" className="ims-input" required />
                            </div>
                        </div>

                        <div className="ims-input-wrap">
                            <label className="ims-label">Email Address</label>
                            <input type="email" placeholder="you@company.com" className="ims-input" required />
                        </div>

                        <div className="ims-input-wrap">
                            <label className="ims-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" className="ims-input" style={{ paddingRight: 44 }} required />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="ims-input-wrap">
                            <label className="ims-label">Confirm Password</label>
                            <input type={showPass ? 'text' : 'password'} placeholder="Repeat password" className="ims-input" required />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: 'var(--teal)', marginTop: 2, flexShrink: 0 }} />
                            <span>
                                I agree to AP Solutions'{' '}
                                <Link to="/terms-and-conditions" style={{ color: 'var(--teal)' }}>Terms of Service</Link>
                                {' '}and{' '}
                                <Link to="/privacy-policy" style={{ color: 'var(--teal)' }}>Privacy Policy</Link>
                            </span>
                        </label>

                        <button type="submit" disabled={loading || !agreed} style={{
                            background: agreed ? 'linear-gradient(135deg,#0d9488,#14b8a6)' : '#334155',
                            color: agreed ? '#fff' : '#64748b', border: 'none', borderRadius: 10,
                            padding: 12, fontSize: '0.95rem', fontWeight: 700,
                            cursor: agreed && !loading ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            transition: 'all 0.2s', fontFamily: 'inherit',
                        }}>
                            {loading ? 'Creating account…' : <>Create Account <FiArrowRight size={16} /></>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;