import React from 'react';
import { MdOutlineAddBox } from 'react-icons/md';

const NewButton = ({ modalId, title, icon = <MdOutlineAddBox size={16} /> }) => {
    return (
        <label
            htmlFor={modalId}
            className="ims-btn ims-btn-teal modal-button"
            style={{ cursor: 'pointer' }}
        >
            {icon}
            {title}
        </label>
    );
};

NewButton.defaultProps = { title: 'New' };

export default NewButton;