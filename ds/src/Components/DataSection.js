import React from 'react';
import DataTable from './DataTable';
import FileUpload from './FileUpload';

function DataSection({ tableData, handleDelete, handleDataUploaded }) {
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