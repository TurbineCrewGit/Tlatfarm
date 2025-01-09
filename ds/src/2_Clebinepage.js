import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Section from './Components/Section.js';
import DataSection from './Components/DataSection.js';
import Header from './Components/Header.js';
import ThemeToggle from './Components/ThemeToggle.js';
import axios from 'axios';

const theme = createTheme();

function Clebine() {
  const [tableData, setTableData] = useState([]); // 테이블 데이터를 관리하는 상태
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedTint, setSelectedTint] = useState(null);

  console.log("table: ", tableData);

  // 초기 백엔드 데이터 가져오기
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get('/api/smartpoles'); // 백엔드 API 호출
        setTableData(response.data); // 상태에 데이터 설정
      } catch (error) {
        console.error('백엔드 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchTableData();
  }, []);

  // 섹션 토글 핸들러
  const handleToggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
    setSelectedTint(null);
  };

  // Tint 버튼 클릭 핸들러
  const handleButtonClick = (tintColor) => {
    setSelectedTint(tintColor);
  };

  // 데이터 삭제 핸들러
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/smartpoles/${id}`); // 백엔드 데이터 삭제
      setTableData((prevData) => prevData.filter((item) => item.id !== id)); // 상태에서 삭제
    } catch (error) {
      console.error('데이터 삭제 중 오류 발생:', error);
      alert('삭제 실패');
    }
  };

  // 데이터 업로드 핸들러
  const handleDataUploaded = (newData) => {
    setTableData((prevData) => [...prevData, ...newData]); // 기존 데이터에 새 데이터 추가
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="planner">
        {/* 헤더 */}
        <Header />

        {/* 데이터 섹션 */}
        <DataSection
          tableData={tableData}
          handleDelete={handleDelete}
          handleDataUploaded={handleDataUploaded}
        />

        {/* 섹션 영역 */}
        <main className="main-container" style={{ position: "relative" }}>
          {[0, 1, 2, 3].map((index) => (
            <Section
              key={index}
              index={index}
              expandedSection={expandedSection}
              handleToggleSection={handleToggleSection}
              selectedTint={selectedTint}
              handleButtonClick={handleButtonClick}
            />
          ))}
        </main>

        {/* 테마 토글 */}
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default Clebine;
