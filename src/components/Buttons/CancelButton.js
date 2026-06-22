import React from 'react';
import { MdClose } from 'react-icons/md';

const CancelButton = ({ extraClass, onClick }) => {
    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
            return;
        }
        const modalEl = e.currentTarget.closest('.modal');
        if (modalEl) {
            const id = modalEl.getAttribute('for');
            if (id) {
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = false;
            }
        }
    };

    return (
        <button
            type="button"
            className={`ims-btn ims-btn-ghost ${extraClass || ''}`}
            onClick={handleClick}
        >
            <MdClose size={14} />
            Cancel
        </button>
    );
};

export default CancelButton;