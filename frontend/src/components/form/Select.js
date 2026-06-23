import React from 'react';

const Select = ({ title = 'Select', name, isRequired, options = ['Option 1', 'Option 2'] }) => {
    return (
        <div className="ims-input-wrap">
            <label className="ims-label">{title}</label>
            <select className="ims-select" name={name} required={isRequired}>
                <option value="" disabled defaultValue="">Choose an option</option>
                {options.map((option, i) => <option key={i} value={option}>{option}</option>)}
            </select>
        </div>
    );
};

export default Select;