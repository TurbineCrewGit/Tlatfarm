// Clebine.js
import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios 임포트 추가
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Section from "./Components/Section.js";
import DataSection from "./Components/DataSection.js";
import Header from "./Components/Header.js";
import ThemeToggle from "./Components/ThemeToggle.js";

const theme = createTheme();

function Clebine({ handleDataUploaded }) { // Props에서 tableData와 onDelete 제거
  const [tableData, setTableData] = useState([]); // 백엔드에서 가져온 데이터를 저장할 상태
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedTint, setSelectedTint] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchSmartPoles();
  }, []);

  // SmartPoles 데이터를 가져오는 함수
  const fetchSmartPoles = async () => {
    try {
      const response = await axios.get("/api/smartpoles"); // 백엔드 API 호출
      setTableData(response.data); // 데이터를 상태에 저장
      setIsLoading(false); // 로딩 완료
    } catch (error) {
      console.error("SmartPoles 데이터를 가져오는 중 오류 발생:", error);
      setError("데이터를 불러오는 데 실패했습니다.");
      setIsLoading(false); // 로딩 완료
    }
  };

  // SmartPoles 삭제 기능
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/smartpoles/${id}`); // 백엔드 API 호출
      setTableData((prevData) => prevData.filter((pole) => pole.id !== id)); // 상태 업데이트
    } catch (error) {
      console.error("SmartPoles 삭제 중 오류 발생:", error);
      setError("데이터를 삭제하는 데 실패했습니다.");
    }
  };

  // 섹션 토글 기능
  const handleToggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
    setSelectedTint(null);
  };

  // 버튼 클릭 시 색상 선택
  const handleButtonClick = (tintColor) => {
    setSelectedTint(tintColor);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="planner">
        <Header />
        <hr
          style={{
            border: "1px solid rgb(36, 36, 36)",
            width: "100vw",
            marginTop: "30px",
          }}
        />
        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{error}</div>
        ) : (
          <DataSection
            tableData={tableData} // 백엔드에서 가져온 데이터를 전달
            handleDelete={handleDelete} // 삭제 함수 전달
            handleDataUploaded={handleDataUploaded}
          />
        )}
        <hr
          style={{
            border: "1px solid rgb(36, 36, 36)",
            width: "100vw",
            margin: "0",
          }}
        />
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
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default Clebine;
