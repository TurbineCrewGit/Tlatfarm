import React, { useState, useEffect } from "react";
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

  // 시간 관련 상태 추가
  const [currentTime, setCurrentTime] = useState(new Date());

  // 실시간 시간 업데이트
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1초마다 시간 갱신

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(intervalId);
  }, []);

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

    if (expandedSection === index) {
      const positionOffsets = [
        { top: "10%", left: "22%" },  // 첫 번째 섹션
        { top: "10%", left: "-12%" },  // 두 번째 섹션
        { top: "10%", left: "-44%" },  // 세 번째 섹션
        { top: "-42%", left: "10%" },  // 네 번째 섹션
        { top: "-43%", left: "-43%" },  // 다섯 번째 섹션
      ];

      const { top, left } = positionOffsets[index] || { top: "30%", left: "40%" };

      return {
        ...baseStyle,
        top,
        left,
        transform: "scale(1.7)", // 확대
        zIndex: 1000,
        padding: "20px",
        paddingBottom: "35px",
      };
    }

    if (expandedSection !== null && expandedSection !== index) {
      return {
        ...baseStyle,
        opacity: 0,
        pointerEvents: "none",
      };
    }

    return baseStyle;
  };

  const getButtonStyle = () => {
    return {
      position: "absolute",
      bottom: "5px", // 바닥에 고정
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "30px", // 버튼 간의 간격
    };
  };

  // 현재 시간 포맷 (시:분:초)
  const timeString = `${currentTime.getFullYear()}년 ${currentTime.getMonth()+1}월 \ ${currentTime.getDate()}일
   ${currentTime.getHours()}시 ${currentTime.getMinutes()}분 ${currentTime.getSeconds()}초`;

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

        {/* 공식 시계 (실시간 시간 표시) */}
        <div className="clock-wrapper">
          <div className="clock" style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
              {timeString}
          </div>
        </div>
        
        <hr style={{
          border: "1px solid rgb(36, 36, 36)",
          width: "100vw",
          margin: "0"
        }} />

        <main className="main-container" style={{ position: "relative" }}>
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="section" style={getSectionStyle(index)}>
              <img src={index % 2 === 0 ? graph : graph2} alt={`graph${index + 1}`} width='400px' />
              <button id="toggleBtn" onClick={() => handleToggleSection(index)}>
                {expandedSection === index ? '축소' : '확대'}
              </button>

              {expandedSection === index && (
                <div style={getButtonStyle()}>
                  <button>일봉</button>
                  <button>주봉</button>
                  <button>월봉</button>
                </div>
              )}
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
