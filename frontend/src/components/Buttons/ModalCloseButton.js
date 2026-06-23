import React from 'react';
import { MdClose } from 'react-icons/md';

const ModalCloseButton = ({ modalId }) => {
    return (
        <label
            htmlFor={modalId}
            style={{
                position: 'absolute', top: 14, right: 14,
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-secondary)',
                transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.color = 'var(--rose)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
            <MdClose size={16} />
        </label>
    );
};

export default ModalCloseButton;