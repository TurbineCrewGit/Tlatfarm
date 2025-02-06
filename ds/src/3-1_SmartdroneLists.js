import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios를 사용하여 백엔드와 통신
import { Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "./Components/Header.js";
import ThemeToggle from "./Components/ThemeToggle.js"; // 작은 따옴표 -> 큰 따옴표로 수정
import "./Styles/App.css";

const theme = createTheme();

function SmartdroneLists() {

  // #region useState
  const [drones, setDrones] = useState([]); // 초기 상태를 빈 배열로 설정
  const [editNameId, setEditNameId] = useState(null);
  const [tempName, setTempName] = useState("");
  const noDronesMessage = "등록된 드론이 없습니다.";
  // #endregion

  // #region useEffect
  // 데이터 가져오기
  useEffect(() => {
    fetchDrones();
  }, []);
  // #endregion

  // drones 데이터 가져오기
  const fetchDrones = async () => {
    try {
      const response = await axios.get("/api/drones"); // 백엔드 API 호출
      setDrones(response.data);
    } catch (error) {
      console.error("드론 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // #region 드론 관리 기능
  // 드론 삭제 기능
  const deleteDrone = async (id) => {
    try {
      await axios.delete(`/api/drones/${id}`); // 백엔드 API 호출
      setDrones((prevDrones) => prevDrones.filter((drone) => drone.id !== id));
    } catch (error) {
      console.error("드론 삭제 중 오류 발생:", error);
    }
  };

  // 드론 추가 기능
  const addDrone = async () => {
    try {
      const newDrone = { name: `New Drone`, status: "Idle" };
      await axios.post("/api/drones", newDrone); // 백엔드 API 호출
      await fetchDrones(); // 데이터 다시 가져오기
    } catch (error) {
      console.error("드론 추가 중 오류 발생:", error);
    }
  };  

  // 이름 변경 시작
  const startEditName = (id, currentName) => {
    setEditNameId(id);
    setTempName(currentName);
  };

  // 이름 변경 저장
  const saveNameChange = async (id) => {
    try {
      const updatedDrone = { name: tempName };
      await axios.put(`/api/drones/${id}`, updatedDrone); // 백엔드 API 호출
      setDrones((prevDrones) =>
        prevDrones.map((drone) =>
          drone.id === id ? { ...drone, name: tempName } : drone
        )
      );
      setEditNameId(null);
      setTempName("");
    } catch (error) {
      console.error("드론 이름 변경 중 오류 발생:", error);
    }
  };

  // 이름 변경 취소
  const cancelEditName = () => {
    setEditNameId(null);
    setTempName("");
  };
  // #endregion

  // return 시작
  return (
      <div>
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
                            <button className="btn" onClick={cancelEditName}>
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
                    <td colSpan="3">{noDronesMessage}</td>
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
      </div>
  );
}

export default SmartdroneLists;
