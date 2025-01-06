import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Papa from 'papaparse'; // CSV 파싱 라이브러리
import MenuBar from './MenuBar';
import ThemeToggle from "./Components/ThemeToggle.js";
import MapSection from "./Components/MapSection";
import BottomSection from "./Components/BottomSection";
import flowDarkImage from './Styles/image/어두운_로고.png';
import "./Styles/App.css";

const theme = createTheme();

function MainPage() {
    const [csvData, setCsvData] = useState([]); // CSV 데이터 저장
    const [droneData, setDroneData] = useState([]); // 드론 데이터 저장
    const [filterID, setFilterID] = useState([]); // 표시할 Clebine 및 Drone ID 관리
    const mapSectionRef = useRef(null); // MapSection에 대한 참조

    const reposition = (type, id) => {
        console.log("reposition 함수 호출:", type, id);
        if (mapSectionRef.current && mapSectionRef.current.reposition) {
            mapSectionRef.current.reposition(type, id);
        } else {
            console.error("reposition 함수가 정의되지 않았습니다.");
        }
    };

    // CSV 데이터 로드
    useEffect(() => {
        const loadCsvData = async () => {
            try {
                const response = await fetch('/mockup.csv');
                if (!response.ok) throw new Error("CSV 파일 로드 실패");

                const csvText = await response.text();
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setCsvData(results.data);
                        console.log("CSV 데이터 로드 완료:", results.data);
                    },
                });
            } catch (error) {
                console.error("CSV 데이터 로드 오류:", error);
            }
        };

        loadCsvData();
    }, []);

    // 드론 데이터 로드
    useEffect(() => {
        const loadDroneData = async () => {
            try {
                const fileUrls = ['/D-1.json', '/D-2.json', '/D-3.json'];
                const allData = await Promise.all(
                    fileUrls.map(async (url) => {
                        const response = await fetch(url);
                        if (!response.ok) throw new Error(`파일 로드 실패: ${url}`);
                        return await response.json();
                    })
                );
                setDroneData(allData);
                console.log("드론 데이터 로드 완료:", allData);
            } catch (error) {
                console.error("드론 데이터 로드 오류:", error);
            }
        };

        loadDroneData();
    }, []);

    // Visibility 토글
    const toggleFilterID = (type, id) => {
        const targetID = `${type}-${id}`;
        setFilterID((prev) =>
            prev.includes(targetID)
                ? prev.filter((item) => item !== targetID)
                : [...prev, targetID]
        );
    };

    const turnOnButton = (type) => {
        const allIDs =
            type === "clebine"
                ? csvData.map((row) => `clebine-${row.ID}`)
                : droneData.map((drone) => `drone-${drone.ID}`);
        setFilterID((prev) => [...new Set([...prev, ...allIDs])]);
    };

    const turnOffButton = (type) => {
        setFilterID((prev) =>
            type === "clebine"
                ? prev.filter((id) => !id.startsWith("clebine-"))
                : prev.filter((id) => !id.startsWith("drone-"))
        );
    };

    // 모든 ID를 기본적으로 filterID에 추가
    useEffect(() => {
        if (csvData.length > 0 || droneData.length > 0) {
            const allIDs = [
                ...csvData.map((row) => `clebine-${row.ID}`),
                ...droneData.map((drone) => `drone-${drone.ID}`),
            ];
            setFilterID(allIDs); // filterID를 모든 ID로 초기화
        }
    }, [csvData, droneData]);

    return (
        <ThemeProvider theme={theme}>
            <div id="mainDiv">
                <header className="header">
                    <a href="https://turbinecrew.co.kr/" target="_blank" rel="noopener noreferrer">
                        <img src={flowDarkImage} alt="Flow" style={{ width: '400px', height: 'auto' }} />
                    </a>
                    <MenuBar />
                </header>

                <hr className="custom_hr" />

                <main className="main-content">
                    {/* Map Section */}
                    <MapSection
                        filterID={filterID}
                        setFilterID={setFilterID}
                        csvData={csvData}
                        droneData={droneData}
                        ref={mapSectionRef}
                    />
                    <BottomSection
                        csvData={csvData}
                        droneData={droneData}
                        toggleFilterID={toggleFilterID}
                        filterID={filterID}
                        turnOnButton={turnOnButton}
                        turnOffButton={turnOffButton}
                        reposition={reposition}
                    />

                </main>

                <ThemeToggle />
            </div>
        </ThemeProvider>
    );
}

export default MainPage;
