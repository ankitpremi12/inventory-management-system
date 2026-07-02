import React from 'react';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import DeleteModal from '../modals/DeleteModal';

const DeleteButton = ({ deleteApiLink, itemId, name, onSuccess }) => {
    const deleteItem = id => {
        const url = `${deleteApiLink}${id}`;
        fetch(url, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Delete failed');
                toast(<DeleteModal name={name} />);
                if (onSuccess) {
                    onSuccess();
                } else {
                    setTimeout(() => {
                        window.location.reload();
                    }, 800);
                }
            })
            .catch(() => toast.error(`Failed to delete ${name || 'item'}.`));
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