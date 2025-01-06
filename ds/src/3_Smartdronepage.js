import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from './Components/Header.js';
import ThemeToggle from "./Components/ThemeToggle.js";
import "./Styles/App.css";

const theme = createTheme();

function Smartdrone() {
  const [drones, setDrones] = useState([
    { id: 1, name: "Drone 1"},
    { id: 2, name: "Drone 2"},
    { id: 3, name: "Drone 3"},
  ]);

  const [editNameId, setEditNameId] = useState(null);
  const [tempName, setTempName] = useState("");

  // 삭제 기능
  const deleteDrone = (id) => {
    setDrones((prevDrones) => prevDrones.filter((drone) => drone.id !== id));
  };

  // 드론 추가 기능
  const addDrone = () => {
    const newDroneId = drones.length ? drones[drones.length - 1].id + 1 : 1;
    setDrones((prevDrones) => [
      ...prevDrones,
      { id: newDroneId, name: `Drone ${newDroneId}`, status: "Idle" },
    ]);
  };

  // 이름 변경 시작
  const startEditName = (id, currentName) => {
    setEditNameId(id);
    setTempName(currentName);
  };

  // 이름 변경 저장
  const saveNameChange = (id) => {
    setDrones((prevDrones) =>
      prevDrones.map((drone) =>
        drone.id === id ? { ...drone, name: tempName } : drone
      )
    );
    setEditNameId(null);
    setTempName("");
  };

  // 이름 변경 취소
  const cancelEditName = () => {
    setEditNameId(null);
    setTempName("");
  };

  // 드론이 없을 때 메시지
  const noDronesMessage = "등록된 드론이 없습니다.";

  return (
    <ThemeProvider theme={theme}>
      <div className="planner">
        <Header />
        <main className="main">
          <h1>Smart Drone List</h1>

          {/* 드론 목록 테이블 */}
          <div className="droneListContainer">

            <table className="droneListTable">
              <thead>
                <tr>
                  <th>드론 ID</th>
                  <th>드론 이름</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {drones.length > 0 ? (
                  drones.map((drone) => (
                    <tr key={drone.id}>
                      <td>{drone.id}</td>
                      <td>
                        {editNameId === drone.id ? (
                          <div>
                            <input
                              type="text"
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              className="nameInput"
                            />
                            <button
                              className="btn"
                              onClick={() => saveNameChange(drone.id)}
                            >
                              저장
                            </button>
                            <button
                              className="btn"
                              onClick={cancelEditName}
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <Link
                            to={`/Smartdronepage/${drone.id}`}
                            className="details-link"
                          >
                            {drone.name}
                          </Link>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn"
                          onClick={() => startEditName(drone.id, drone.name)}
                        >
                          이름 변경
                        </button>
                        <button
                          className="btn"
                          onClick={() => deleteDrone(drone.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="noDrones">
                    <td colSpan="3">
                      {noDronesMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

          {/* 추가 및 테마 토글 버튼 */}
          <div className="buttonGroup">
            <button className="btn" onClick={addDrone}>
              드론 추가
            </button>
            <ThemeToggle />
          </div>
        </main>
      </div >
    </ThemeProvider >
  );
}

export default Smartdrone;
