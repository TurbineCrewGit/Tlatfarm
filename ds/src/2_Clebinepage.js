import React, { useState } from "react";
import "./Styles/Clebine.css";
import logo from './dark_logo.png';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar';
import graph from './graph.png';
import graph2 from './graph2.png';
import FileUpload from './Components/FileUpload';
import DataTable from './Components/DataTable';
import {Link} from 'react-router-dom';

const theme = createTheme();

function Clebine() {
  const [tableData, setTableData] = useState([
    // { id: '1', powerProduction: '85MW', latitude: '37.5665', longitude: '126.9780' },
  ]);

  const handleDataUploaded = (newData) => {
    setTableData(prevData => [...prevData, ...newData]);
  };
  

  const handleDelete = (id) => {
    setTableData(tableData.filter(row => row.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="planner">
        <header className="header">
          <Link to='/'>
          <img src={logo} alt="Turbine Planner" width='400px' />
          </Link>
          
          <MenuBar />
        </header>
        <hr style={{ 
          border: "1px solid rgb(36, 36, 36)",  // 테두리 두께와 색상 설정
          width: "100vw",  // 전체 화면 너비에 맞추기
          margin: "0"  // 여백을 없애기
        }} />


        <main className="main-container">
          <div className="section" style={{background: "skyblue"}}>
            <img src={graph} alt="graph" width='400px' />
            <span>예시 이미지-설명</span>
          </div>
          <div className="section" style={{background: "seagreen"}}>
            <img src={graph2} alt="graph2" width="400px" />
            <span>예시 이미지-설명</span>
          </div>
          <div className="section" style={{background: "coral"}}>
            <img src={graph} alt="graph" width='400px' />
            <span>예시 이미지-설명</span>
          </div>
          <div className="section" style={{background: "khaki"}}>
            <img src={graph2} alt="graph2" width="400px" />
            <span>예시 이미지-설명</span>
          </div>
          <div className="section" style={{background: "dodgerblue"}}>
            <img src={graph2} alt="graph2" width="400px" />
            <span>예시 이미지-설명</span>
          </div>
        </main>

        <hr style={{ 
          border: "1px solid rgb(36, 36, 36)",  // 테두리 두께와 색상 설정
          width: "100vw",  // 전체 화면 너비에 맞추기
          margin: "0"  // 여백을 없애기
        }} />


        <div className="list-section" style={{marginTop: '2px'}}>
          <div className="list-container">
            <DataTable tableData={tableData} onDelete={handleDelete} />
            <div className="file-upload-container">
            <FileUpload onDataUploaded={handleDataUploaded} tableData={tableData} />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Clebine;
