import React from "react";
import "./Styles/App.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar.js';
import ThemeToggle from "./Components/ThemeToggle.js";
import flowImage from './flow_noname_image.png';

const theme = createTheme();

function Main() {


    // return 시작
    return (
        <ThemeProvider theme={theme}>
            <div id="mainDiv">
                <header className="header">
                    
                <a href="https://turbinecrew.co.kr/" target="_blank" rel="noopener noreferrer">
                    <img
                        src={flowImage}
                        alt="Flow" 
                        style={{ width: '450px', height: 'auto' }} 
                    />
                </a>

                    {/* 메뉴바 */}
                    <MenuBar />
                </header>

                <hr className="custom_hr"></hr>
                <img src={`${process.env.PUBLIC_URL}/컴포지션 1.gif`} alt="Turbine Planner" style={{backgroundColor:"none"}}/>

                <ThemeToggle />
            </div>
            
        </ThemeProvider>
    );
}

export default Main;
