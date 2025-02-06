// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "./Styles/App.css";
import Main from "./1_Mainpage.js";
import Clebine from "./2_Clebinepage.js";
import Smartdrone from "./3_Smartdronepage.js";
import Management from "./4_Managementpage.js";

import ClebineDetail from "./2-1_ClebineDetail.js"; // 상세 페이지 컴포넌트 임포트
import TestPage from "./TestPage.js";
import SmartDronepage_Details from "./3-1_Smartdronepage_Details.js";

const theme = createTheme();

function App() {
  const [tableData, setTableData] = useState([]);

  const handleDataUploaded = (newData) => {
    setTableData(prevData => [...prevData, ...newData]);
  };

  const handleDelete = (id) => {
    setTableData((prevData) => prevData.filter((row) => row.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App grid-container">
        {/* 라우트 설정 */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route 
            path="/clebinepage" 
            element={
              <Clebine 
                tableData={tableData} 
                onDelete={handleDelete} 
                handleDataUploaded={handleDataUploaded} 
              />
            } 
          />
          <Route path="/clebinepage/:id" element={<ClebineDetail tableData={tableData} />} /> {/* 상세 페이지 라우트 추가 */}
          <Route path="/Smartdronepage" element={<Smartdrone />} />
          <Route path="/Smartdronepage/:id" element={<SmartDronepage_Details />} />
          <Route path="/managementpage" element={<Management />} />
          <Route path="/test" element={<TestPage />} />

        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
