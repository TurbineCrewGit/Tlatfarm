// planner.js

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Draggable from "react-draggable";
import "./Styles/App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './Components/Header.js';
import ThemeToggle from "./Components/ThemeToggle.js";
import MapComponent from './Components/MapComponents.js';
import useMarkers from './Components/useMarkers.js';
import MarkerTable from './Components/MarkerTable.js';
import { API_BASE_URL } from './Components/constants.js';


const theme = createTheme();

function Smartdrone() {
  // 드론 목록 데이터 (임시 데이터)
  const drones = [
    { id: 1, name: "Drone A", status: "Active" },
    { id: 2, name: "Drone B", status: "Idle" },
    { id: 3, name: "Drone C", status: "Maintenance" },
  ];

  // return 시작
  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <div className="planner">

          <Header />

          <main className="main">

            <h1>Smart Drone List</h1>

            {/* 드론 목록 테이블 */}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {drones.map((drone) => (
                  <tr key={drone.id}>
                    <td> {drone.id} </td>
                    <td>
                      <Link to={`/Smartdronepage/${drone.id}`} className="details-link">{drone.name}
                      </Link></td>
                    <td>{drone.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>


            <ThemeToggle />

          </main>
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default Smartdrone;
