import React from 'react';

const DataTable = ({ tableData, onDelete }) => {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>전력생산량</th>
            <th>위도</th>
            <th>경도</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.id}</td>
              <td>{row.powerProduction}</td>
              <td>{row.latitude}</td>
              <td>{row.longitude}</td>
              <td>
                <button 
                  onClick={() => onDelete(row.id)} 
                  className="delete-button"
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    color: 'red', 
                    cursor: 'pointer' 
                  }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
