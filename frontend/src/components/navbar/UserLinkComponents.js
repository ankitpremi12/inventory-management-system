import React from 'react';
import { Link } from 'react-router-dom';

const UserLinkComponents = ({ to, extraClass, icon, name, extraComponent }) => {
    return (
        <li>
            <Link
                to={to}
                className={`flex items-center gap-x-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-teal-400 hover:bg-white/5 transition-all duration-150 ${extraClass}`}
            >
                <span className="text-base">{icon}</span>
                {name}
                {extraComponent}
            </Link>
        </li>
    );
};

export default UserLinkComponents;