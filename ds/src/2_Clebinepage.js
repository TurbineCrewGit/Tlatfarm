import React, { useState } from "react";
import "./Styles/Clebine.css";
import logo from './Styles/images/dark_logo.png';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar';
import graph from './graph.png';
import graph2 from './graph2.png';
import FileUpload from './Components/FileUpload';
import DataTable from './Components/DataTable';
import { Link } from 'react-router-dom';

  const theme = createTheme();

function Clebine() {
  const [tableData, setTableData] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleDataUploaded = (newData) => {
    setTableData(prevData => [...prevData, ...newData]);
  };

  const handleDelete = (id) => {
    setTableData(tableData.filter(row => row.id !== id));
  };

  const handleToggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const getSectionStyle = (index) => {
    const baseStyle = {
      background: ["skyblue", "seagreen", "coral", "khaki", "dodgerblue"][index],
      transition: "all 0.3s ease",
      overflow: "hidden",
      position: "relative",
      transformOrigin: "top left", // 확대 기준점
    };
  
    // 각 섹션이 확장된 상태일 때
    if (expandedSection === index) {
      const positionOffsets = [
        { top: "10%", left: "22%" },  // 첫 번째 섹션
        { top: "10%", left: "-12%" },  // 두 번째 섹션
        { top: "10%", left: "-44%" },  // 세 번째 섹션
        { top: "-42%", left: "10%" },  // 네 번째 섹션
        { top: "-43%", left: "-43%" },  // 다섯 번째 섹션
      ];
  
      // 각 섹션마다 다르게 top, left 값을 설정
      const { top, left } = positionOffsets[index] || { top: "30%", left: "40%" };
  
      return {
        ...baseStyle,
        top,
        left,
        transform: "scale(1.7)", // 확대
        zIndex: 1000,
      };
    }
  
    // 다른 섹션은 투명하게 처리
    if (expandedSection !== null && expandedSection !== index) {
      return {
        ...baseStyle,
        opacity: 0,
        pointerEvents: "none",
      };
    }
  
    // 기본 상태
    return baseStyle;
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
          border: "1px solid rgb(36, 36, 36)",
          width: "100vw",
          margin: "0"
        }} />
        
        <main className="main-container" style={{ position: "relative" }}>
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="section" style={getSectionStyle(index)}>
              <img src={index % 2 === 0 ? graph : graph2} alt={`graph${index + 1}`} width='400px' />
              <span>예시 이미지-설명</span>
              <button id="toggleBtn" onClick={() => handleToggleSection(index)}>
                {expandedSection === index ? '축소' : '확대'}
              </button>
            </div>
          ))}
        </main>

        <hr style={{
          border: "1px solid rgb(36, 36, 36)",
          width: "100vw",
          margin: "0"
        }} />

        <div className="list-section" style={{ marginTop: '2px' }}>
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
