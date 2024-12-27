import React from "react";
import "./Styles/App.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar';
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
                            터빈 크루
                        </h1>
                    </a>

                    

                    {/* 메뉴바 */}
                    <MenuBar />
                </header>
                <img src={`${process.env.PUBLIC_URL}/컴포지션 1.gif`} alt="Turbine Planner" style={{backgroundColor:"none"}}/>

                <ThemeToggle />
            </div>
        </ThemeProvider>
    );
}

export default Main;
