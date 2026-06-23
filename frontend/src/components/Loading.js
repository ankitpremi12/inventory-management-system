import React from 'react';

const Loading = () => {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--navy)',
        }}>
            {/* Spinner */}
            <div style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '3px solid var(--navy-border)',
                borderTopColor: 'var(--teal)',
                animation: 'spin 0.8s linear infinite',
                marginBottom: 16,
            }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Loading;