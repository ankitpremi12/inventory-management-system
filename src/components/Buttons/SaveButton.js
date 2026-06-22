import React from 'react';
import { BsSave2 } from 'react-icons/bs';

const SaveButton = ({ extraClass }) => {
    return (
        <button
            type="submit"
            className={`ims-btn ims-btn-teal ${extraClass || ''}`}
        >
            <BsSave2 size={14} />
            Save
        </button>
    );
};

export default SaveButton;