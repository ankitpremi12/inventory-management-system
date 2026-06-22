import React from 'react';

const DoubleInput = ({ title = 'Double Input', name1, name2, type1, type2, placeholder1, placeholder2, value1, value2 }) => {
    return (
        <div className="ims-input-wrap">
            <label className="ims-label">{title}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                    name={name1} type={type1} placeholder={placeholder1}
                    className="ims-input" defaultValue={value1}
                />
                <input
                    name={name2} type={type2} placeholder={placeholder2}
                    className="ims-input" defaultValue={value2}
                />
            </div>
        </div>
    );
};

export default DoubleInput;