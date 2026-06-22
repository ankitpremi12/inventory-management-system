import React from 'react';

const DashboardPageHeading = ({ name, value, buttons }) => {
    return (
        <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 12, marginBottom: 24,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{name}</h1>
                {value !== undefined && (
                    <span style={{
                        background: 'rgba(20,184,166,0.15)',
                        color: 'var(--teal)',
                        fontSize: '0.75rem', fontWeight: 700,
                        padding: '3px 10px', borderRadius: 20,
                        border: '1px solid rgba(20,184,166,0.3)',
                    }}>
                        {value} records
                    </span>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {buttons?.map((btn, i) => <span key={i}>{btn}</span>)}
            </div>
        </div>
    );
};

export default DashboardPageHeading;