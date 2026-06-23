import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const footerLinks = [
    { heading: 'Product', links: [{ label: 'Features', to: '/features' }, { label: 'Dashboard', to: '/dashboard' }] },
    { heading: 'Company', links: [{ label: 'Resources', to: '/resources' }] },
    { heading: 'Legal', links: [{ label: 'Privacy Policy', to: '/privacy-policy' }, { label: 'Terms & Conditions', to: '/terms-and-conditions' }] },
];

const Footer = () => {
    return (
        <footer style={{
            background: 'linear-gradient(180deg,var(--navy-card) 0%,var(--navy) 100%)',
            borderTop: '1px solid var(--navy-border)',
            padding: '60px 24px 32px',
        }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 40, marginBottom: 48 }}>
                    {/* Brand column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#0d9488,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14 }}>A</div>
                            <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>AP <span style={{ color: 'var(--teal)' }}>Solutions</span></span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', lineHeight: 1.7, maxWidth: 200 }}>
                            Modern inventory management for wholesale and retail businesses.
                        </p>
                        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                            {[
                                { Icon: FiGithub, url: 'https://github.com' },
                                { Icon: FiTwitter, url: 'https://twitter.com' },
                                { Icon: FiLinkedin, url: 'https://linkedin.com' }
                            ].map(({ Icon, url }, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{
                                    width: 34, height: 34, borderRadius: 9,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--navy-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-muted)', textDecoration: 'none',
                                    transition: 'all 0.15s ease',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--teal)'; e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--navy-border)'; }}
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map(col => (
                        <div key={col.heading}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                                {col.heading}
                            </p>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <Link to={link.to} style={{
                                            color: 'var(--text-muted)', textDecoration: 'none',
                                            fontSize: '0.85rem', transition: 'color 0.15s ease',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                    paddingTop: 24, borderTop: '1px solid var(--navy-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: 12,
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        © {new Date().getFullYear()} AP Solutions. All rights reserved.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Built with{' '}
                        <span style={{ color: 'var(--teal)' }}>React</span>
                        {' '}·{' '}
                        <span style={{ color: 'var(--violet)' }}>Node.js</span>
                        {' '}·{' '}
                        <span style={{ color: '#10b981' }}>MongoDB</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;