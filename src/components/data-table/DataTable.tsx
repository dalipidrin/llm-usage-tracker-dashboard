import React from 'react';
import './DataTable.css';

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="data-table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>User</th>
            <th>Vendor</th>
            <th>API Type</th>
            <th>Total Usage</th>
            <th>Total Revenue</th>
            <th>Total Cost</th>
            <th>Total Profit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.customerId}</td>
              <td>{row.userId}</td>
              <td>{row.vendorName}</td>
              <td>{row.apiType}</td>
              <td>{row.totalUsage}</td>
              <td>{row.totalRevenue}</td>
              <td>{row.totalCost}</td>
              <td>{row.totalProfit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
