import React, { useState } from "react";
import "./Styles/Clebine.css";
import logo from './dark_logo.png';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar';
import graph from './graph.png';
import graph2 from './graph2.png';
import ThemeToggle from "./Components/ThemeToggle.js";

const theme = createTheme();

function Clebine() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      console.log("파일 업로드:", selectedFile.name);
    } else {
      console.log("파일이 선택되지 않았습니다.");
    }
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
          </div>

          <div className="section">
            <img src={graph2} alt="graph2" width="400px" />
          </div>

          <div className="section">
            <img src={graph} alt="graph" width='400px' />
          </div>
          <div className="section">
            <img src={graph} alt="graph" width='400px' />
          </div>
          <div className="section">
            <img src={graph} alt="graph" width='400px' />
          </div>
          <div className="section">
            <img src={graph} alt="graph" width='400px' />
          </div>
        </main>
      
        <div className="file-upload-section">
          <div className="file-upload-box">
            <input 
              type="file" 
              onChange={handleFileChange} 
              accept="*/*"
            />
            <div className="upload-button-container">
              <button id="addBtn" onClick={handleFileUpload}>추가</button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Clebine;
