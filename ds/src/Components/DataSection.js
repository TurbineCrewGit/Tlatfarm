// DataSection.js
import React from 'react';
import DataTable from './DataTable';
import FileUpload from './FileUpload';

function DataSection({ tableData, handleDelete, handleDataUploaded }) { // handleDelete로 prop 이름 일치
  return (
    <div className="list-section" style={{ marginTop: '2px' }}>
      <div className="list-container">
        <DataTable tableData={tableData} onDelete={handleDelete} />
        <div className="file-upload-container">
          <FileUpload onDataUploaded={handleDataUploaded} tableData={tableData} />
        </div>
      </div>
    </div>
  );
}

export default DataSection;
