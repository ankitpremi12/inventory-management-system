import React from 'react';
import { BsPrinter } from 'react-icons/bs';

const PrintButton = () => {
    return (
        <button
            onClick={() => window.print()}
            className="ims-btn ims-btn-ghost"
        >
            <BsPrinter size={14} />
            Print
        </button>
    );
};

export default PrintButton;