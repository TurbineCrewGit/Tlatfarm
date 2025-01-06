// Clebine.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Section from './Components/Section.js';
import DataSection from './Components/DataSection.js';
import Header from './Components/Header.js';

const theme = createTheme();

function Clebine({ tableData, onDelete, handleDataUploaded }) {
  const [expandedSection, setExpandedSection] = React.useState(null);
  const [selectedTint, setSelectedTint] = React.useState(null);

  const handleToggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
    setSelectedTint(null);
  };

  const handleButtonClick = (tintColor) => {
    setSelectedTint(tintColor);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="planner">
        <Header />
        <hr style={{ border: "1px solid rgb(36, 36, 36)", width: "100vw", marginTop: "30px" }} />
        <DataSection
          tableData={tableData}
          handleDelete={onDelete}
          handleDataUploaded={handleDataUploaded}
        />
        <hr style={{ border: "1px solid rgb(36, 36, 36)", width: "100vw", margin: "0" }} />
        <main className="main-container" style={{ position: "relative" }}>
          {[0, 1, 2, 3, 4].map((index) => (
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
      </div>
    </ThemeProvider>
  );
}

export default Clebine;
