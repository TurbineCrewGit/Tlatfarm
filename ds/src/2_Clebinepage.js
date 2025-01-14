// src/Clebine.js
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
  const [aggregatedWeatherData, setAggregatedWeatherData] = useState([]); // 집계된 날씨 데이터

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

  // 스마트 폴의 날씨 데이터 가져와서 집계
  useEffect(() => {
    const fetchAllWeatherData = async () => {
      try {
        const fetchPromises = tableData.map(async (item) => {
          try {
            const response = await fetch(`${process.env.PUBLIC_URL}/${item.id}.csv`);
            const csvText = await response.text();
            const lines = csvText.split('\n');
            if (lines.length > 1) {
              const latestData = lines[1].split(',');
              const temperature = parseFloat(latestData[2]);
              const humidity = parseFloat(latestData[3]);
              const windDirect = parseFloat(latestData[5]);
              const windSpeed = parseFloat(latestData[4]);
              const rainfall = parseFloat(latestData[8]);

              // 데이터 유효성 검사
              if (!isNaN(windDirect) && !isNaN(temperature) && !isNaN(humidity) && !isNaN(rainfall)) {
                return { id: item.id, temperature, humidity, windDirect, windSpeed, rainfall };
              } else {
                return null;
              }
            } else {
              return null;
            }
          } catch (error) {
            console.error(`Error fetching weather data for ID ${item.id}:`, error);
            return null;
          }
        });

        const weatherDataArray = await Promise.all(fetchPromises);
        const validWeatherData = weatherDataArray.filter(data => data !== null);

        setAggregatedWeatherData(validWeatherData);
      } catch (error) {
        console.error('Error aggregating weather data:', error);
      }
    };

    if (tableData.length > 0) {
      fetchAllWeatherData();
    }
  }, [tableData]);

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
  const handleDataUploaded = async (newData) => {
    try {
      // 백엔드에 새 데이터 저장
      console.log("Uploading new data: ", newData);
      const uploadPromises = newData.map(async (data) => {
        const response = await axios.post('/api/smartpoles', data);
        console.log("Response data:", response.data); // 추가된 로그
        return data; // 서버에서 처리없이 데이터 반환
      });

      const uploadedData = await Promise.all(uploadPromises);
      console.log("Uploaded data from server", uploadedData);
      setTableData(prevData => [...prevData, ...uploadedData]); // 서버에서 반환된 데이터로 상태 업데이트

    } catch (error) {
      console.error('데이터 추가 중 오류 발생:', error);
      alert('데이터 추가 실패');
    }
  };

  // 섹션 제목 배열 (풍향/풍속, 습도, 강수량, 기온)
  const sectionTitles = ["풍향/풍속", "습도", "강수량", "기온"];

  return (
    <ThemeProvider theme={theme}>
      <body className="planner">
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
          {sectionTitles.map((title, index) => (
            <Section
              key={index}
              index={index}
              sectionTitle={title}
              expandedSection={expandedSection}
              handleToggleSection={handleToggleSection}
              selectedTint={selectedTint}
              handleButtonClick={handleButtonClick}
              data={aggregatedWeatherData} // 집계된 날씨 데이터 전달
            />
          ))}
        </main>

        {/* 테마 토글 */}
        <ThemeToggle />
      </body>
    </ThemeProvider>
  );
}

export default Clebine;
