import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios를 사용하여 백엔드와 통신
import { Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "./Components/Header.js";
import MenuBar from "./MenuBar.js";
import ThemeToggle from "./Components/ThemeToggle.js"; // 작은 따옴표 -> 큰 따옴표로 수정
import "./Styles/App.css";
import SmartdroneLists from "./3-1_SmartdroneLists.js";
import SmartDrone_Details from "./3-1_Smartdronepage_Details.js";

const theme = createTheme();

function Smartdrone() {

  const [selectedDroneId, setSelectedDroneId] = useState(null);

  // return 시작
  return (
    <ThemeProvider theme={theme}>

        <Header />
        <MenuBar />
        <main className="drone-main main">
          <div className="drone-contents">
            {/* 드론 목록 테이블 */}
            <SmartdroneLists onDroneSelect={setSelectedDroneId}/>
          </div>
          <div className="drone-contents">
            {/* 드론 상세 정보 */}
            <SmartDrone_Details droneId={selectedDroneId}/>
          </div>
          {/* <p>임시) 선택된 드론 ID: {selectedDroneId}</p> */}
        </main>

    </ThemeProvider>
  );
}

export default Smartdrone;
