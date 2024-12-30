import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUpload = ({ onDataUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file ? file.name : null);
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        const headers = lines[0].split('\t').map(header => header.trim());

        const jsonData = lines.slice(1).map(line => {
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
        resolve(jsonData);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseXLSX = (file) => {
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

          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        const file = fileInput.files[0];
        try {
          let newData;
          if (file.name.toLowerCase().endsWith('.csv')) {
            newData = await parseCSV(file);
          } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
            newData = await parseXLSX(file);
          } else {
            throw new Error('지원하지 않는 파일 형식입니다.');
          }

          // 데이터가 성공적으로 업로드되면 상위 컴포넌트로 전달
          onDataUploaded(newData);
          setSelectedFile(null);
          fileInput.value = '';
        } catch (error) {
          console.error('파일 처리 중 오류 발생:', error);
          alert('파일 처리 중 오류가 발생했습니다.');
        }
      }
    } else {
      console.log("파일이 선택되지 않았습니다.");
    }
  };

  return (
    <div className="file-upload-container">
      {/* 파일 이름을 버튼 위에 표시 */}
      {selectedFile && <div className="file-name">선택된 파일: {selectedFile}</div>}

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
        <button onClick={handleFileUpload} className="add-button">
          추가
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
