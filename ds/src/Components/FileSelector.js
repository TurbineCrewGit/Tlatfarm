import React from 'react';
// import "../Styles/Clebine.css";

const FileSelector = ({ selectedFile, onFileChange, onClearFile }) => {
  return (
    <div>
      <input
        type="file"
        onChange={onFileChange}
        accept=".csv, .xlsx, .xls"
        style={{ display: 'none' }}
        id="fileInput"
      />
      <label htmlFor="fileInput" className="upload-button">
        파일 선택
      </label>
    </div>
  );
};

export default FileSelector;
