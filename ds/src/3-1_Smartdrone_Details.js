// planner.js

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom"; // useParams 가져오기
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

function SmartDrone_Details() {

  const { id } = useParams(); // URL에서 id 가져오기

  const mapRef = useRef(null);
  const tableRef = useRef(null);
  const mapComponentRef = useRef(null);
  const {
    coordinates,
    setCoordinates,
    markersRef,
    addMarker,
    removeMarker,
    updateFlightModes,
    moveItem,
    moveMarkerUp,
    moveMarkerDown,
    resetMap,
    updateMarkerImages,
  } = useMarkers(mapRef);

  const [inputLat, setInputLat] = useState("");
  const [inputLng, setInputLng] = useState("");
  const [inputAlt, setInputAlt] = useState(""); // 고도 입력 상태
  const [inputPort, setInputPort] = useState(""); // 포트 입력 상태
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [loadingFixed, setLoadingFixed] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isControllerOpen, setIsControllerOpen] = useState(true);


  const toggleControllerContent = () => {
    setIsControllerOpen((prev) => !prev);
  };

  // 서버 전송 함수
  // 좌표 전송
  const sendCoordinatesToServer = useCallback(async () => {
    if (!inputPort) {
      alert("포트 번호를 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}`, { coordinates, port: inputPort });
      console.log("서버 응답:", response.data);
      toast.success("데이터가 성공적으로 전송되었습니다!");
    } catch (error) {
      console.error("데이터 전송 실패:", error);
      toast.error("데이터 전송에 실패했습니다. 다시 시도해주세요.");
    }
  }, [coordinates, inputPort]);

  // 명령 전송
  const sendCommandToServer = useCallback(async (command) => {
    if (!inputPort) {
      alert("포트 번호를 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}`, { command });
      console.log("서버 응답:", response.data);
      toast.success("명령이 성공적으로 전송되었습니다!");
    } catch (error) {
      console.error("명령 전송 실패:", error);
      toast.error("명령 전송에 실패했습니다. 다시 시도해주세요.");
    }
  }, [coordinates, inputPort]);



  // 최적화 함수
  const optimizeMarkers = useCallback(() => {
    if (coordinates.length < 2) {
      alert("마커가 2개 이상 있어야 최적화를 수행할 수 있습니다.");
      return;
    }

    // 최적화 시작 알림
    setIsOptimizing(true);
    setLoadingFixed(false); // 초기 상태

    // 비동기 작업으로 최적화 처리
    setTimeout(() => { // 실제로는 복잡한 계산이 필요할 수 있으므로 예시로 setTimeout 사용
      // 초기 경로: 현재 좌표 순서
      let optimized = [...coordinates];

      const calculateTotalDistance = mapComponentRef.current.calculateTotalDistance;

      // 2-opt 알고리즘 적용
      const twoOpt = () => {
        let improved = true;
        let best = [...optimized];
        let bestDistance = calculateTotalDistance(best);

        while (improved) {
          improved = false;
          for (let i = 1; i < best.length - 1; i++) {
            for (let k = i + 1; k < best.length; k++) {
              const newRoute = twoOptSwap(best, i, k);
              const newDistance = calculateTotalDistance(newRoute);
              if (newDistance < bestDistance) {
                best = newRoute;
                bestDistance = newDistance;
                improved = true;
              }
            }
          }
        }

        return best;
      };

      const twoOptSwap = (route, i, k) => {
        const newRoute = route.slice(0, i);
        const reversedSegment = route.slice(i, k + 1).reverse();
        const remaining = route.slice(k + 1);
        return newRoute.concat(reversedSegment).concat(remaining);
      };

      optimized = twoOpt();

      // 최적화된 순서로 상태 업데이트
      setCoordinates(optimized);

      // 마커 순서도 업데이트
      const newMarkers = optimized.map(coord => {
        return markersRef.current.find(marker => {
          const pos = marker.getPosition();
          return (
            pos.getLat().toFixed(6) === coord.lat.toFixed(6) &&
            pos.getLng().toFixed(6) === coord.lng.toFixed(6)
          );
        });
      }).filter(marker => marker !== undefined);

      markersRef.current = newMarkers;

      // 마커 이미지 업데이트 (시작 마커 이미지 변경)
      updateMarkerImages();
      updateFlightModes(); // 비행 방식 업데이트

      // 최적화 완료 알림
      setIsOptimizing(false);
      setLoadingFixed(true); // 로딩 위치 고정
      toast.success("경로가 최적화되었습니다!");
    }, 1000); // 최적화 소요 시간에 따라 조정
  }, [coordinates, markersRef, mapComponentRef, setCoordinates, updateMarkerImages, updateFlightModes]);






  // 마커 수동 추가 함수
  const handleAddMarker = useCallback(() => {
    if (inputLat && inputLng && inputAlt) { // 모든 필드가 입력되었는지 확인
      const lat = parseFloat(inputLat);
      const lng = parseFloat(inputLng);
      const alt = parseFloat(inputAlt);
      if (isNaN(lat) || isNaN(lng) || isNaN(alt)) {
        alert("위도, 경도, 고도는 숫자여야 합니다.");
        return;
      }
      const latlng = new window.kakao.maps.LatLng(lat, lng);
      addMarker(latlng, alt);
      setInputLat("");
      setInputLng("");
      setInputAlt("");
      // `addMarker` 내부에서 `updateFlightModes`가 호출됩니다.
    } else {
      alert("위도, 경도, 고도를 모두 입력해주세요.");
    }
  }, [inputLat, inputLng, inputAlt, addMarker]);




  // return 시작
  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <div className="planner">

          <Header />

          <main className="main">
          {/* <h1>{id}번 드론 페이지 입니다</h1> 드론 ID 출력 */}

            <Draggable handle=".dragSpotContainer">
              <div className={`remote-control-panel ${isControllerOpen ? "open" : "closed"}`}>
                <div className="controller-header">
                  <div className="dragSpotContainer">
                    <div className="dragSpot">=</div>
                    <div className="controller-title">비행 컨트롤러</div>
                  </div>
                  <button className="controller-toggle-btn" onClick={toggleControllerContent}>
                    {isControllerOpen ? "∧" : "∨"}
                  </button>
                </div>

                {isControllerOpen && (
                  <div className="controller-contents">
                    <hr />
                    {/* 포트 입력 및 비행 제어 버튼 */}
                    <div className="input-container port-input">
                      <select
                        className="port-number"
                        value={inputPort}
                        onChange={(e) => setInputPort(e.target.value)}
                      >
                        <option value="" disabled>포트 선택</option>
                        {Array.from({ length: 9 }, (_, i) => (
                          <option key={`COM${i + 1}`} value={`COM${i + 1}`}>
                            {`COM${i + 1}`}
                          </option>
                        ))}
                      </select>
                      <div className="command-btn-container">
                        <button className="btn btn-command btn-command-arming" onClick={() => sendCommandToServer("ARMING")}>시동</button>
                        <button className="btn btn-command btn-command-start" onClick={() => sendCommandToServer("START")}>비행 시작</button>
                        <button className="btn btn-command btn-command-stop" onClick={() => sendCommandToServer("STOP")}>비행 종료</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Draggable>

            <MapComponent
              ref={mapComponentRef}
              addMarker={addMarker}
              coordinates={coordinates}
              mapRef={mapRef}
              isMapOpen={isMapOpen}
              setIsMapOpen={setIsMapOpen}
            />


            <div id="coordInfo" className={isMapOpen ? 'map-open' : 'map-closed'}>
              <MarkerTable
                coordinates={coordinates}
                moveItem={moveItem}
                moveMarkerUp={moveMarkerUp}
                moveMarkerDown={moveMarkerDown}
                removeMarker={removeMarker}
                updateFlightModes={updateFlightModes}
                setCoordinates={setCoordinates}
                tableRef={tableRef}
              />
              {/* **버튼들을 그룹화한 컨테이너 추가** */}
              <div className="buttons-container">
                <div className="input-container">
                  <input
                    id="inputLat" /* 포커스 이동을 위한 ID 추가 */
                    type="number"
                    placeholder="위도"
                    value={inputLat}
                    onChange={(e) => setInputLat(e.target.value)}
                    step="0.000001"
                  />
                  <input
                    type="number"
                    placeholder="경도"
                    value={inputLng}
                    onChange={(e) => setInputLng(e.target.value)}
                    step="0.000001"
                  />
                  <input
                    type="number"
                    placeholder="고도"
                    value={inputAlt}
                    onChange={(e) => setInputAlt(e.target.value)}
                    step="1"
                    className="input-alt"
                  />
                  <button
                    className="btn btn-add"
                    onClick={handleAddMarker}
                  >마커 추가</button>
                </div>

                {/* **버튼을 별도의 컨테이너로 이동** */}
                <div className="optimize-button-container">


                  <button
                    className="btn btn-reset"
                    onClick={resetMap}
                  >
                    초기화
                  </button>

                  <button
                    className="btn btn-submit"
                    onClick={sendCoordinatesToServer}
                  >
                    데이터 전송
                  </button>

                  <button
                    className="btn btn-optimize"
                    onClick={optimizeMarkers}
                    disabled={isOptimizing}
                  >
                    최적화
                  </button>

                </div>

              </div>
            </div>

            <ThemeToggle />

            <ToastContainer
              position="bottom-right" // 토스트 위치 우측 하단으로 변경
              autoClose={2000} // 토스트 자동 닫힘 시간 (2초)
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            {/* 로딩 인디케이터 추가 */}
            {isOptimizing && <div className={`loading ${loadingFixed ? 'fixed' : ''}`}>최적화 중...</div>}
          </main>
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default SmartDrone_Details;
