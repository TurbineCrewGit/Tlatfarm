import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Section from './Components/Section.js';
import DataSection from './Components/DataSection.js';
import Header from './Components/Header.js';
import ThemeToggle from './Components/ThemeToggle.js';
import axios from 'axios';

const theme = createTheme();

function Clebine({ tableData, onDelete, handleDataUploaded }) {
  const [expandedSection, setExpandedSection] = React.useState(null);
  const [selectedTint, setSelectedTint] = React.useState(null);
  const [error, setError] = useState(null); // Error state

  const handleToggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
    setSelectedTint(null);
  };

  const handleButtonClick = (tintColor) => {
    setSelectedTint(tintColor);
  };

  // SmartPoles 삭제 기능
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/smartpoles/${id}`); // 백엔드 API 호출
      onDelete(id); // Use the passed `onDelete` prop to update tableData
    } catch (error) {
      console.error("SmartPoles 삭제 중 오류 발생:", error);
      alert("삭제 실패");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <body className="planner">
        <Header />
        <hr style={{ border: "1px solid rgb(36, 36, 36)", width: "100vw", marginTop: "30px" }} />
        <DataSection
          tableData={tableData}
          handleDelete={handleDelete}
          handleDataUploaded={handleDataUploaded}
        />
        <hr style={{ border: "1px solid rgb(36, 36, 36)", width: "100vw", margin: "0" }} />
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
      </body>
      <ThemeToggle/>
    </ThemeProvider>
  );
}

export default Clebine;
