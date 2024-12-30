import React from "react";
import "./Styles/App.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar.js';
import ThemeToggle from "./Components/ThemeToggle.js";
import MapComponent from './Components/MainMapComponent.js';
import flowImage from './dark_logo.png';

const theme = createTheme();

function Main() {
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

                <hr className="custom_hr" />

                {/* Add the map component */}
                <main className="main-content">
                    <MapComponent />
                </main>

                <ThemeToggle />
            </div>
        </ThemeProvider>
    );
}

export default Main;