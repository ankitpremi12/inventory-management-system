import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const DetailsComponent = ({ icon, name, subMenus }) => {
    return (
        <details className="ims-sidebar-details group">
            <summary className="ims-sidebar-group select-none">
                <span className="text-base flex-shrink-0">{icon}</span>
                <span className="flex-1">{name}</span>
                <FiChevronDown className="ml-auto transition-transform duration-300 group-open:rotate-180 text-sm opacity-60" />
            </summary>
            <nav className="ims-sidebar-sub mt-1">
                {subMenus?.map((subMenu, index) => <span key={index}>{subMenu}</span>)}
            </nav>
        </details>
    );
};

export default DetailsComponent;