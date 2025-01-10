// src/Components/DataSection.js
import React from 'react';
import DataTable from './DataTable';
import FileUpload from './FileUpload';

function DataSection({ tableData, handleDelete, handleDataUploaded }) {
  return (
    <div className="list-section" style={{ marginTop: '2px' }}>
      <div className="list-container">
        {/* DataTable에 tableData와 handleDelete 전달 */}
        <DataTable tableData={tableData} onDelete={handleDelete} />

        {/* FileUpload에 handleDataUploaded와 tableData 전달 */}
        <div className="file-upload-container">
          <FileUpload onDataUploaded={handleDataUploaded} tableData={tableData} />
        </div>
      </div>
    </div>
  );
}

export default DataSection;
