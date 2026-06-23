import React from 'react';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import DeleteModal from '../modals/DeleteModal';

const DeleteButton = ({ deleteApiLink, itemId, name, onSuccess }) => {
    const deleteItem = _id => {
        const url = `${deleteApiLink}${_id}`;
        fetch(url, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                toast(<DeleteModal name={name} />);
                if (onSuccess) {
                    onSuccess();
                } else {
                    setTimeout(() => {
                        window.location.reload();
                    }, 800);
                }
            });
    };

    return (
        <button
            onClick={() => deleteItem(itemId)}
            title={`Delete ${name}`}
            type="button"
            style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: 7,
                background: 'rgba(244,63,94,0.12)',
                color: 'var(--rose)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.25)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.12)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
            <RiDeleteBin6Fill size={14} />
        </button>
    );
};

export default DeleteButton;