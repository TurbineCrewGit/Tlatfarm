import React from "react";
import "./Styles/App.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar.js';
import FlowLogo from './Styles/image/flow_noname_image.png';
import ThemeToggle from "./Components/ThemeToggle.js";


const theme = createTheme();

function Main() {
    // return 시작
    return (
        <ThemeProvider theme={theme}>
            <div>
                <header className="header">
                    <a href="https://turbinecrew.co.kr/">
                        <h1 className='title'>
                            <img src={FlowLogo} height="30%" width="30%">
                            </img>
                        </h1>
                    </a>
                    

                    {/* 메뉴바 */}
                    <MenuBar />
                    
                </header>
                <hr width="2000px" color="black"/>
                <img src={`${process.env.PUBLIC_URL}/컴포지션 1.gif`} alt="Turbine Planner" style={{backgroundColor:"none"}}/>
                <ThemeToggle />
            </div>
        </ThemeProvider>
    );
}

export default Main;
