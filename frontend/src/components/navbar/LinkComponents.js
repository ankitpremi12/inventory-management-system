import React from 'react';
import { NavLink } from 'react-router-dom';

const LinkComponents = ({ to, icon, name }) => {
    return (
        <NavLink
            to={to}
            end={to === ''}
            className={({ isActive }) =>
                `ims-sidebar-link ${isActive ? 'active' : ''}`
            }
        >
            {({ isActive }) => (
                <>
                    <span className="text-base flex-shrink-0">{icon}</span>
                    <span style={{ flexGrow: 1 }}>{name}</span>
                    {isActive && (
                        <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            background: 'rgba(15, 40, 60, 0.1)',
                            color: '#0f283c',
                            padding: '2px 8px',
                            borderRadius: 99,
                            marginLeft: 'auto'
                        }}>Active</span>
                    )}
                </>
            )}
        </NavLink>
    );
};

export default LinkComponents;