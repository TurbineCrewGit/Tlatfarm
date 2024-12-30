import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUpload = ({ onDataUploaded, tableData }) => {  // tableData prop 추가
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

  // 중복 ID 체크 함수
  const checkDuplicateIds = (newData) => {
    const existingIds = new Set(tableData.map(item => item.id));
    const duplicates = newData.filter(item => existingIds.has(item.id));
    const uniqueData = newData.filter(item => !existingIds.has(item.id));
    
    return { duplicates, uniqueData };
  };

  const parseCSV = (file, filterById = false) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        const headers = lines[0].split('\t').map(header => header.trim());

        let jsonData = lines.slice(1).map(line => {
          const values = line.split('\t').map(value => value.trim());
          const row = {};
          headers.forEach((header, i) => {
            if (header.toLowerCase() === 'id') {
              row.id = values[i];
            } else if (header.toLowerCase() === '전력 생산량') {
              row.powerProduction = values[i];
            } else if (header.toLowerCase() === '위도') {
              row.latitude = values[i];
            } else if (header.toLowerCase() === '경도') {
              row.longitude = values[i];
            }
          });
          return row;
        });

        if (filterById && filterId) {
          jsonData = jsonData.filter(row => row.id === filterId);
        }

        resolve(jsonData);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseXLSX = (file, filterById = false) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          let jsonData = XLSX.utils.sheet_to_json(worksheet);
          jsonData = jsonData.map(row => ({
            id: row.id || row.ID,
            powerProduction: row['전력 생산량'],
            latitude: row['위도'],
            longitude: row['경도']
          }));

          if (filterById && filterId) {
            jsonData = jsonData.filter(row => row.id === filterId);
          }

          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (filterById = true) => {
    if (selectedFile) {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        const file = fileInput.files[0];
        try {
          let newData;
          if (file.name.toLowerCase().endsWith('.csv')) {
            newData = await parseCSV(file, filterById);
          } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
            newData = await parseXLSX(file, filterById);
          } else {
            throw new Error('지원하지 않는 파일 형식입니다.');
          }

          if (filterById && filterId && newData.length === 0) {
            alert('해당 ID의 데이터를 찾을 수 없습니다.');
            return;
          }

          // 중복 ID 체크
          const { duplicates, uniqueData } = checkDuplicateIds(newData);
          
          if (duplicates.length > 0) {
            const duplicateIds = duplicates.map(item => item.id).join(', ');
            alert(`다음 ID는 이미 존재하여 추가되지 않았습니다: ${duplicateIds}`);
          }

          if (uniqueData.length > 0) {
            onDataUploaded(uniqueData);
            if (!filterById) {
              setFilterId('');
            }
          } else {
            alert('추가할 수 있는 새로운 데이터가 없습니다.');
          }
          
        } catch (error) {
          console.error('파일 처리 중 오류 발생:', error);
          alert('파일 처리 중 오류가 발생했습니다.');
        }
      }
    } else {
      alert("파일을 선택해주세요.");
    }
  };

  return (
    <div className="file-upload-container">
      {selectedFile && (
        <div className="file-name">
          선택된 파일: {selectedFile}
          <button onClick={clearSelectedFile} style={{ marginLeft: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px'}}>
            x
          </button>
        </div>
      )}

      <div className="button-container">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv, .xlsx, .xls"
          style={{ display: 'none' }}
          id="fileInput"
        />
        <label htmlFor="fileInput" className="upload-button">
          파일 선택
        </label>
        <input
          type="text"
          value={filterId}
          onChange={handleIdChange}
          placeholder="ID 입력"
          className="id-input"
        />
        <button 
          onClick={() => handleFileUpload(true)} 
          className="idAddBtn"
          disabled={!selectedFile || !filterId}
        >
          ID 데이터 추가
        </button>
        <button 
          onClick={() => handleFileUpload(false)} 
          className="add-all-button"
          disabled={!selectedFile}
        >
          전체 추가
        </button>
      </div>
    </div>
  );
};

export default FileUpload;