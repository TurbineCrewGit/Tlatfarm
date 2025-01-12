// src/Components/FileUpload.js
import React, { useState } from 'react';
import { parseCSV, parseXLSX } from '../Components/FileParsing.js';
import { checkDuplicateIds } from '../Components/CheckDuplicateIds.js';
import FileSelector from '../Components/FileSelector.js';
import IdInput from '../Components/IdInput.js';
import '../Styles/DataTable.css';

const FileUpload = ({ onDataUploaded, tableData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filterId, setFilterId] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file ? file.name : null);
  };

  const handleIdChange = (event) => {
    setFilterId(event.target.value);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilterId('');
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleFileUpload = async (filterById = true) => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      const file = fileInput.files[0];
      try {
        let newData;
        if (file.name.toLowerCase().endsWith('.csv')) {
          newData = await parseCSV(file);
        } else if (
          file.name.toLowerCase().endsWith('.xlsx') ||
          file.name.toLowerCase().endsWith('.xls')
        ) {
          newData = await parseXLSX(file);
        } else {
          throw new Error('지원하지 않는 파일 형식입니다.');
        }
        console.log("Parsed newData: ", newData);

        if (filterById && filterId) {
          newData = newData.filter((row) => row.id === filterId);
          if (newData.length === 0) {
            alert('해당 ID의 데이터를 찾을 수 없습니다.');
            return;
          }
        }

        const { duplicates, uniqueData } = checkDuplicateIds(newData, tableData);

        if (duplicates.length > 0) {
          const duplicateIds = duplicates.map((item) => item.id).join(', ');
          alert(`다음 ID는 이미 존재하여 추가되지 않았습니다: ${duplicateIds}`);
        }

        if (uniqueData.length > 0) {
          onDataUploaded(uniqueData); // Clebine 컴포넌트로 데이터 전달
          if (!filterById) {
            setFilterId('');
          }
          clearSelectedFile();
        } else {
          alert('추가할 수 있는 새로운 데이터가 없습니다.');
        }
      } catch (error) {
        console.error('파일 처리 중 오류 발생:', error);
        alert('파일 처리 중 오류가 발생했습니다.');
      }
    } else {
      alert('파일을 선택해주세요.');
    }
  };

  return (
    <div className="file-upload-container">
      {selectedFile && (
        <div className="file-name">
          선택된 파일: {selectedFile}
          <button
            className="deleteBtn"
            onClick={clearSelectedFile}
            style={{ marginLeft: '10px' }}
          >
            x
          </button>
        </div>
      )}
      <div className="button-container">
        <FileSelector selectedFile={selectedFile} onFileChange={handleFileChange} />
        <IdInput filterId={filterId} onIdChange={handleIdChange} />
        <button
          id="idAddBtn"
          className="add-button"
          onClick={() => handleFileUpload(true)}
          disabled={!selectedFile || !filterId}
        >
          ID 데이터 추가
        </button>
        <button
          className="add-all-button"
          onClick={() => handleFileUpload(false)}
          disabled={!selectedFile}
        >
          전체 추가
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
