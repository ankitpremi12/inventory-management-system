import React from 'react';

const ModalHeading = ({ modalHeading }) => {
    return (
        <div style={{ marginBottom: 20, paddingRight: 36 }}>
            <h2 style={{
                fontSize: '1.1rem', fontWeight: 700,
                color: 'var(--text-primary)', margin: 0, lineHeight: 1.3,
            }}>
                {modalHeading}
            </h2>
            <div style={{
                marginTop: 8, height: 2, width: 40,
                background: 'linear-gradient(90deg,var(--teal),var(--violet))',
                borderRadius: 2,
            }} />
        </div>
    );
};

export default ModalHeading;