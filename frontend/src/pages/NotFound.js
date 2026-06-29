import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div style={{
            minHeight: '100vh', background: 'var(--navy)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '40px 24px',
            animation: 'fadeIn 0.5s ease-out',
        }}>
            {/* 404 glyph */}
            <div style={{
                fontSize: '8rem', fontWeight: 900, lineHeight: 1,
                background: 'linear-gradient(135deg,var(--teal),var(--violet))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 16,
            }}>404</div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Page not found</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 380, lineHeight: 1.7, marginBottom: 36 }}>
                The page you're looking for doesn't exist or has been moved.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/" className="ims-btn ims-btn-teal" style={{ padding: '10px 24px' }}>
                    <FiHome size={15} /> Go Home
                </Link>
                <button onClick={() => window.history.back()} className="ims-btn ims-btn-ghost" style={{ padding: '10px 24px' }}>
                    <FiArrowLeft size={15} /> Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;