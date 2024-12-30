import React, { useState } from "react";
import "./Styles/Clebine.css";
import logo from './dark_logo.png';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar';
import graph from './graph.png';
import graph2 from './graph2.png';
import FileUpload from './Components/FileUpload';
import DataTable from './Components/DataTable';

const theme = createTheme();

function Clebine() {
  const [tableData, setTableData] = useState([
    { id: '1', powerProduction: '85MW', latitude: '37.5665', longitude: '126.9780' },
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
            <img src={graph2} alt="graph2" width="400px" />
            <span>설명</span>
          </div>
          <div className="section">
            <img src={graph2} alt="graph2" width="400px" />
            <span>설명</span>
          </div>
        </main>

        <div className="list-section">
          <div className="list-container">
            <DataTable tableData={tableData} onDelete={handleDelete} />
            <div className="file-upload-container">
              <FileUpload onDataUploaded={handleDataUploaded} />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Clebine;
