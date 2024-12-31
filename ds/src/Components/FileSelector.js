import React from 'react';

const FileSelector = ({ selectedFile, onFileChange, onClearFile }) => {
  return (
    <div>
      {selectedFile && (
        <div className="file-name">
          선택된 파일: {selectedFile}
          <button
            onClick={onClearFile}
            style={{
              marginLeft: '10px',
              color: 'red',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
            }}
          >
            x
          </button>
        </div>
      )}
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
