import React, { useState, useRef, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuBar from './MenuBar';
import ThemeToggle from "./Components/ThemeToggle.js";
import MapSection from "./Components/1_MapSection.js";
import BottomSection from "./Components/1_BottomSection.js";
import { loadSmartPoleData, loadDroneData } from "./Components/1_DataLoader.js";
//import { createWebSocketConnection } from "./utils/1_WebSocketClient.js";

import "./Styles/1_Mainpage.css";

//import Header from './Components/Header.js'; // 헤더 통일

const theme = createTheme();

function MainPage() {
    const [smartPoleData, setSmartPoleData] = useState([]); // SmartPole 데이터 상태
    const [droneData, setDroneData] = useState([]); // 드론 데이터 저장
    const [filterID, setFilterID] = useState([]); // 표시할 Clebine 및 Drone ID 관리
    const mapSectionRef = useRef(null); // MapSection에 대한 참조
    const [isDarkMode, setIsDarkMode] = useState(false); // 다크 모드 상태 감지
    //const [dataChanged, setDataChanged] = useState(true); // 데이터 변경 감지
    const [refreshTime, setRefreshTime] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(60); // 타이머 상태

    // 다크 모드 상태 감지
    useEffect(() => {
        const handleDarkModeChange = () => {
            setIsDarkMode(document.body.classList.contains('dark-mode'));
        };

        handleDarkModeChange(); // 초기 다크 모드 상태 확인
        const observer = new MutationObserver(handleDarkModeChange);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    // MapSection의 reposition 함수 호출
    const reposition = (type, id) => {
        console.log("reposition 함수 호출:", type, id);
        if (mapSectionRef.current && mapSectionRef.current.reposition) {
            mapSectionRef.current.reposition(type, id);
        } else {
            console.error("reposition 함수가 정의되지 않았습니다.");
        }
    };
    
    /*/ 데이터 로드
    useEffect(() => {
        //if (!dataChanged) return;
        let intervalTime;
        const fetchData = async () => {
            clearInterval(intervalTime);
            console.log("데이터 로드 시작");
            try {
                // Clebine 데이터 로드
                const smartPoles = await loadSmartPoleData();
                if(JSON.stringify(smartPoleData) !== JSON.stringify(smartPoles)){
                    setSmartPoleData(smartPoles);
                }
                
                // 드론 데이터 로드
                const drone = await loadDroneData();
                if(JSON.stringify(droneData) !== JSON.stringify(drone)){
                    setDroneData(drone);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
            intervalTime = setInterval(fetchData, 60000);
            setRefreshTime(intervalTime);
            //setDataChanged(false);
        };
        fetchData();
    }, []); // filterID와 연결 해제. 첫 렌더링 시에만 데이터 로드
    */

    const fetchData = async () => {
        console.log("데이터 로드 시작");
        try {
            const smartPoles = await loadSmartPoleData();
            if (JSON.stringify(smartPoleData) !== JSON.stringify(smartPoles)) {
                setSmartPoleData(smartPoles);
            }

            const drone = await loadDroneData();
            if (JSON.stringify(droneData) !== JSON.stringify(drone)) {
                setDroneData(drone);
            }
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        }
        setTimeRemaining(60); // 타이머 리셋
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(() => {
            fetchData();
        }, 60000); // 1분마다 fetchData 호출

        const countdownId = setInterval(() => {
            setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 60));
        }, 1000); // 1초마다 타이머 감소

        setRefreshTime(intervalId);

        return () => {
            clearInterval(intervalId);
            clearInterval(countdownId);
        };
    }, []);

    /*useEffect(() => {
        console.log("WebSocket 연결 시도");
    
        const socket = createWebSocketConnection(
            (message) => {
                // 수신된 데이터를 처리하는 기존 로직
                console.log("수신 메시지:", message);
            },
            (dataChangedFlag) => {
                // 데이터 변경 플래그 설정
                if (dataChangedFlag) {
                    setDataChanged(true); // 데이터 변경 감지
                }
            }
        );
        return () => {
            socket.close(); // WebSocket 연결 종료
        };
    }, []); */// 웹소켓을 이용해서 데이터 변경 감지

    // Visibility 토글
    const toggleFilterID = (type, id) => {
        const targetID = `${type}-${id}`;
        console.log(smartPoleData);
        setFilterID((prev) =>
            prev.includes(targetID)
                ? prev.filter((item) => item !== targetID)
                : [...prev, targetID]
        );
    };

    // Clebine 및 Drone 표시 버튼 활성화/비활성화
    const turnOnButton = (type) => {
        const allIDs =
            type === "clebine"
                ? smartPoleData.map((row) => `clebine-${row.id}`)
                : droneData.map((drone) => `drone-${drone.droneId}`);
        setFilterID((prev) => [...new Set([...prev, ...allIDs])]);
    };
    const turnOffButton = (type) => {
        setFilterID((prev) =>
            type === "clebine"
                ? prev.filter((id) => !id.startsWith("clebine-"))
                : prev.filter((id) => !id.startsWith("drone-"))
        );
    };

    // useMemo를 사용하여 filterID 계산
    const memoizedFilterID = useMemo(() => {
        if (smartPoleData.length === 0 && droneData.length === 0) return filterID;

        const allIDs = [
            ...smartPoleData.map((row) => `clebine-${row.id}`),
            ...droneData.map((drone) => `drone-${drone.droneId}`),
        ];

        return allIDs;
    }, [smartPoleData, droneData]);

    // filterID 상태 업데이트
    useEffect(() => {
        setFilterID(memoizedFilterID);
    }, [memoizedFilterID]);

    return (
        <ThemeProvider theme={theme}>
            <div id="main_Div" >
                <header className="mainheader">
                    <a href="https://turbinecrew.co.kr/" target="_blank" rel="noopener noreferrer">
                        <img
                            alt="Flow"
                        />
                    </a>
                    <MenuBar />
                </header>
                {/*<Header /> 헤더 통일해야할 때 해당 부분 사용*/}
                <hr className="custom_hr" />

                <main className="main-content">
                    {/* Map Section */}
                    <MapSection
                        filterID={filterID}
                        setFilterID={setFilterID}
                        smartPoleData={smartPoleData}
                        droneData={droneData}
                        ref={mapSectionRef}
                        isDarkMode={isDarkMode}
                        timeRemaining={timeRemaining}
                        onRefresh={fetchData} // MapSection에서 fetchData 호출 가능
                    />
                    <BottomSection
                        smartPoleData={smartPoleData}
                        droneData={droneData}
                        toggleFilterID={toggleFilterID}
                        filterID={filterID}
                        turnOnButton={turnOnButton}
                        turnOffButton={turnOffButton}
                        reposition={reposition}
                        isDarkMode={isDarkMode}
                    />
                </main>

                <ThemeToggle/>
            </div>
        </ThemeProvider>
    );
}

export default MainPage;
