import React, { useState } from "react";
import "./Styles/Clebine.css";
import logo from './dark_logo.png';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar';
import graph from './graph.png';
import graph2 from './graph2.png';
import ThemeToggle from "./Components/ThemeToggle.js";
import * as XLSX from 'xlsx';

const theme = createTheme();

function Clebine() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([
    { id: '1', powerProduction: '85MW', latitude: '37.5665', longitude: '126.9780' },
  ]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file ? file.name : null);
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line); // 빈 줄 제거
        const headers = lines[0].split('\t').map(header => header.trim()); // 탭으로 구분된 헤더

        const jsonData = lines.slice(1).map(line => {
          const values = line.split('\t').map(value => value.trim());
          const row = {};
          headers.forEach((header, i) => {
            if (header.toLowerCase() === 'id') {
              row.id = values[i];
            } else if (header.toLowerCase() === '전력 생산량') {
              row.powerProduction = values[i]; // 전력 생산량
            } else if (header.toLowerCase() === '위도') {
              row.latitude = values[i]; // 위도
            } else if (header.toLowerCase() === '경도') {
              row.longitude = values[i]; // 경도
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

          // 데이터를 처리해서 필요한 필드만 추출하여 반환
          jsonData = jsonData.map(row => ({
            id: row.id || row.ID, // 'id' 컬럼을 'ID'로 바꿀 수도 있음
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

          // 테이블 데이터에 새 데이터 추가
          setTableData(prevData => [...prevData, ...newData]);
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

  const handleDelete = (id) => {
    setTableData(tableData.filter(row => row.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="planner">
        <header className="header">
          <img src={logo} alt="Turbine Planner" width='400px' />
          <MenuBar />
        </header>

        <main className="grid-container">
          <div className="section">
            <img src={graph} alt="graph" width='400px' />
            <span>설명</span>
          </div>
          <div className="section">
            <img src={graph2} alt="graph2" width="400px" />
            <span>설명</span>
          </div>
          <div className="section">
            <img src={graph} alt="graph" width='400px' />
            <span>설명</span>
          </div>
          <div className="section">
            <img src={graph} alt="graph" width='400px' />
            <span>설명</span>
          </div>
          <div className="section">
            <img src={graph} alt="graph" width='400px' />
            <span>설명</span>
          </div>
        </main>

        <div className="list-section">
          <div className="list-container">
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
                          onClick={() => handleDelete(row.id)} 
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
            {selectedFile && (
              <div className="selected-file">
                <span>선택된 파일: {selectedFile}</span>
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
              <label htmlFor="fileInput" className="upload-button" style={{color: "black"}}>
                파일 선택
              </label>
              <button className="add-button" onClick={handleFileUpload}>추가</button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Clebine;
