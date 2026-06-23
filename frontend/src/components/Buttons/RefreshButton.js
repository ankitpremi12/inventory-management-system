import React from 'react';
import { FiRefreshCcw } from 'react-icons/fi';

const RefreshButton = () => {
    return (
        <button
            onClick={() => window.location.reload()}
            className="ims-btn ims-btn-ghost"
        >
            <FiRefreshCcw size={14} />
            Refresh
        </button>
    );
};

export default RefreshButton;