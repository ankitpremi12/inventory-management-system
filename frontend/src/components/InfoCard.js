import React from 'react';

const gradients = [
    { bg: 'linear-gradient(135deg,rgba(20,184,166,0.15),rgba(20,184,166,0.05))', accent: '#14b8a6', border: 'rgba(20,184,166,0.25)' },
    { bg: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.05))', accent: '#8b5cf6', border: 'rgba(139,92,246,0.25)' },
    { bg: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(99,102,241,0.05))', accent: '#6366f1', border: 'rgba(99,102,241,0.25)' },
    { bg: 'linear-gradient(135deg,rgba(6,182,212,0.15),rgba(6,182,212,0.05))',   accent: '#06b6d4', border: 'rgba(6,182,212,0.25)' },
    { bg: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05))', accent: '#10b981', border: 'rgba(16,185,129,0.25)' },
    { bg: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05))', accent: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
];

let cardIndex = 0;

const InfoCard = ({ extraClass, name, status }) => {
    const g = gradients[cardIndex++ % gradients.length];

    return (
        <div
            className={extraClass}
            style={{
                background: g.bg,
                border: `1px solid ${g.border}`,
                borderRadius: 14,
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px ${g.border}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{name}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: g.accent, margin: 0, lineHeight: 1 }}>{status ?? '—'}</p>
        </div>
    );
};

export default InfoCard;