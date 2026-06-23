import React from 'react';

const TableRow = ({ tableRowsData }) => {
    return (
        <tr className="ims-table-row">
            {tableRowsData?.map((cell, i) => (
                <td key={i} className="ims-table-cell">{cell}</td>
            ))}
        </tr>
    );
};

export default TableRow;