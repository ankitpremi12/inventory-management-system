import React from 'react';

const Input = ({ title = 'Input Field', type = 'text', placeholder = 'Type here…', name, isRequired, value }) => {
    return (
        <div className="ims-input-wrap">
            <label className="ims-label">{title}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="ims-input"
                name={name}
                required={isRequired}
                defaultValue={value}
            />
        </div>
    );
};

export default Input;