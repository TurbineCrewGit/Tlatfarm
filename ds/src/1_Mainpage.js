import React, { useEffect, useRef, useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Papa from 'papaparse'; // CSV 파싱 라이브러리
import MenuBar from './MenuBar';
import ThemeToggle from "./Components/ThemeToggle.js";
import { KAKAO_MAP_APPKEY } from './Components/constants';
import flowDarkImage from './Styles/image/어두운_로고.png';
import expandIcon from './Styles/image/expand_button.png'; // 확장 아이콘 경로
import "./Styles/App.css";

const theme = createTheme();

function Main() {
    const mapRef = useRef(null); // 지도 객체 참조
    const markersRef = useRef([]); // 마커 객체 참조
    const CustomOverlayRef = useRef([]); // Custom Overlay 객체 참조
    const [csvData, setCsvData] = useState([]); // CSV 데이터 저장
    const [droneData, setDroneData] = useState([]); // 드론 데이터 저장
    const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태
    const [isExpanded, setIsExpanded] = useState(false); // 확장 상태
    const [filterID, setFilterID] = useState([]); // 표시할 Clebine 및 Drone ID 관리
    const [buttonStates, setButtonStates] = useState({
        clebine: true,
        smartDrone: true,
    });

 

    const clearAllMarkers = () => {
        // 모든 마커의 지도 설정을 null로 변경
        markersRef.current.forEach((marker) => marker.setMap(null));
        // 배열 비우기
        markersRef.current = [];
        console.log("모든 마커가 제거되었습니다.");
    };
    

    // 카카오맵 초기화
    useEffect(() => {
        const initializeMap = () => {
            const container = document.getElementById("kakaoMap"); // 지도 컨테이너
            const options = {
                center: new window.kakao.maps.LatLng(35.222172, 126.847596), // 초기 중심 좌표
                level: 3, // 확대 수준
            };
            const map = new window.kakao.maps.Map(container, options); // 지도 객체 생성
            mapRef.current = map; // 지도 객체 저장
            setIsMapLoaded(true); // 지도 로드 상태 업데이트
            console.log("카카오맵 초기화 완료");
        };

        const loadKakaoMapScript = () => {
            const script = document.createElement("script");
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APPKEY}&autoload=false`;
            script.async = true;

            script.onload = () => {
                console.log("카카오맵 스크립트 로드 성공.");
                window.kakao.maps.load(initializeMap);
            };
            script.onerror = () => {
                console.error("카카오맵 스크립트 로드 실패. API 키를 확인하세요.");
            };

            document.head.appendChild(script);
            return () => {
                document.head.removeChild(script);
                console.log("카카오맵 스크립트 언로드.");
            };
        };

        loadKakaoMapScript();
    }, []);

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
                    error: (error) => console.error("CSV 파싱 오류:", error),
                });
            } catch (error) {
                console.error("CSV 로드 오류:", error);
            }
        };

        loadCsvData();
    }, []);

    // 드론 데이터 로드
    useEffect(() => {
        const loadDroneData = async () => {
            try {
                const fileUrls = ['/D-1.json', '/D-2.json', '/D-3.json'];
    
                const allData = await Promise.all(fileUrls.map(async (url) => {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`파일 로드 실패: ${url}`);
                    const data = await response.json();
                    return data;
                }));
    
                setDroneData(allData);
                console.log("드론 데이터 로드 완료:", allData);
            } catch (error) {
                console.error("드론 데이터 로드 오류:", error);
            }
        };
    
        if (buttonStates.smartDrone) {
            loadDroneData();
        }
    }, [buttonStates.smartDrone]);

    // 초기화 시 모든 ID를 filterID에 추가 ******************************
    useEffect(() => {
        const allIDs = [
            ...csvData.map(row => `clebine-${row.ID}`),
            ...droneData.map(drone => `drone-${drone.ID}`),
        ];
        setFilterID(allIDs);
    }, [csvData, droneData]);

    // Visibility 토글 함수
    const toggleFilterID = (type, id) => {
        clearAllMarkers(); // 모든 마커 제거
        const targetID = `${type}-${id}`;
        setFilterID(prev => 
            prev.includes(targetID)
                ? prev.filter(item => item !== targetID) // ID 제거
                : [...prev, targetID] // ID 추가
        );
        console.log("filterID toggled: ",targetID);
        console.log("filterID: ", filterID);
    };

    const turnOffButton = (type) => {
    
        // Remove all IDs of the given type from filterID
        setFilterID((prevFilterID) => {
            if (type === "clebine") {
                return prevFilterID.filter((id) => !id.startsWith("clebine-"));
            } else if (type === "smartDrone") {
                return prevFilterID.filter((id) => !id.startsWith("drone-"));
            }
            return prevFilterID;
        });
    };
    
    const turnOnButton = (type) => {
        const allIDs =
            type === "clebine"
                ? csvData.map((row) => `clebine-${row.ID}`)
                : droneData.map((drone) => `drone-${drone.ID}`);

    
        // filterID에 해당 타입의 모든 ID를 추가
        setFilterID((prevFilterID) =>
            Array.from(new Set([...prevFilterID, ...allIDs])) // 중복 제거
        );
        console.log(`${type} IDs added to filterID`);
    };
    

// 지도 로드 후 Clebine 마커 추가
useEffect(() => {
    if (!isMapLoaded || csvData.length === 0) return;

    const addMarkers = () => {
        csvData.forEach((row) => {
            const targetID = `clebine-${row.ID}`;
            if (!filterID.includes(targetID)) return; // filterID에 포함되지 않으면 스킵

            if (row.Latitude && row.Longitude) {
                const lat = parseFloat(row.Latitude);
                const lng = parseFloat(row.Longitude);
                const power = parseFloat(row.Power);

                if (!isNaN(lat) && !isNaN(lng)) {
                    // 충전량에 따라 마커 이미지 설정
                    let markerImageSrc;
                    if (power === 0) {
                        markerImageSrc = `${process.env.PUBLIC_URL}/0w.png`;
                    } else if (power >= 1 && power <= 49) {
                        markerImageSrc = `${process.env.PUBLIC_URL}/0_49w.png`;
                    } else if (power >= 50 && power <= 99) {
                        markerImageSrc = `${process.env.PUBLIC_URL}/50_100w.png`;
                    } else if (power >= 100 && power <= 149) {
                        markerImageSrc = `${process.env.PUBLIC_URL}/100_150w.png`;
                    } else if (power >= 150) {
                        markerImageSrc = `${process.env.PUBLIC_URL}/150_200w.png`;
                    }

                    const markerImage = new window.kakao.maps.MarkerImage(
                        markerImageSrc,
                        new window.kakao.maps.Size(60, 70)
                    );

                    const hoverImage = new window.kakao.maps.MarkerImage(
                        markerImageSrc,
                        new window.kakao.maps.Size(70, 80)
                    );

                    const marker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(lat, lng),
                        map: mapRef.current,
                        image: markerImage,
                        zIndex: 1,
                    });

                    // Custom Overlay로 작은 점 추가
                    const dotOverlay = new window.kakao.maps.CustomOverlay({
                        position: new window.kakao.maps.LatLng(lat, lng),
                        content: '<div style="width: 6px; height: 6px; background-color: red; border-radius: 50%; position: absolute; transform: translate(-50%, -50%); z-index: 2;"></div>',
                        zIndex: 2,
                    });

                    dotOverlay.setMap(mapRef.current);

                    const infoWindow = new window.kakao.maps.InfoWindow({
                        content: `<div style="padding:5px; font-size:12px; color:#000;">ID: ${row.ID}<br>Power: ${row.Power}</div>`,
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                        infoWindow.open(mapRef.current, marker);
                        marker.setImage(hoverImage);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                        infoWindow.close();
                        marker.setImage(markerImage);
                    });

                    markersRef.current.push(marker);
                    CustomOverlayRef.current.push(dotOverlay);
                }
            }
        });
        console.log("모든 Clebine 마커 추가 완료.");
    };

    addMarkers();

    return () => {
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
        CustomOverlayRef.current.forEach((overlay) => overlay.setMap(null));
        CustomOverlayRef.current = [];
    };
}, [isMapLoaded, csvData, filterID]);

useEffect(() => {
    if (!isMapLoaded || droneData.length === 0) return;

    const addDroneMarkers = () => {
        droneData.forEach((drone) => {
            const targetID = `drone-${drone.ID}`;
            if (!filterID.includes(targetID)) return; // filterID에 포함되지 않으면 스킵

            drone.waypoints
                .filter((wp) => wp.isItme === "1")
                .forEach((wp) => {
                    const lat = parseFloat(wp.lat);
                    const lng = parseFloat(wp.long);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        const markerImage = new window.kakao.maps.MarkerImage(
                            wp.action === "16"
                                ? `${process.env.PUBLIC_URL}/이동중.gif`
                                : `${process.env.PUBLIC_URL}/충전중.gif`,
                            new window.kakao.maps.Size(65, 65),
                            { offset: new window.kakao.maps.Point(32.5, 32.5) }
                        );

                        const hoverImage = new window.kakao.maps.MarkerImage(
                            wp.action === "16"
                                ? `${process.env.PUBLIC_URL}/이동중.gif`
                                : `${process.env.PUBLIC_URL}/충전중.gif`,
                            new window.kakao.maps.Size(80, 80),
                            { offset: new window.kakao.maps.Point(40, 40) }
                        );

                        const marker = new window.kakao.maps.Marker({
                            position: new window.kakao.maps.LatLng(lat, lng),
                            map: mapRef.current,
                            image: markerImage,
                            zIndex: 4,
                        });

                        const infoWindow = new window.kakao.maps.InfoWindow({
                            content: `<div style="padding:3px; font-size:12px; color:#000;">ID: ${drone.ID}<br>Status: ${(() => {
                                switch (wp.action) {
                                    case "5":
                                        return "이륙";
                                    case "6":
                                        return "착륙";
                                    case "16":
                                        return "이동";
                                    default:
                                        return wp.action;
                                }
                            })()}</div>`
                        });

                        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                            infoWindow.open(mapRef.current, marker);
                            marker.setImage(hoverImage);
                        });

                        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                            infoWindow.close();
                            marker.setImage(markerImage);
                        });

                        markersRef.current.push(marker);
                    }
                });
        });
        console.log("모든 드론 마커 추가 완료.");
    };

    addDroneMarkers();
    
    return () => {
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
    }

}, [isMapLoaded, droneData, filterID]);

// 지도 중심 재설정
const resetMapCenter = () => {
    if (!mapRef.current) {
        console.error("지도 객체가 초기화되지 않았습니다.");
        return;
    }
    const defaultCenter = new window.kakao.maps.LatLng(35.222172, 126.847596);
    mapRef.current.setCenter(defaultCenter);
    console.log("지도 중심 재설정 완료.");
};

// 지도 중심 각자 위치로로 재설정
const reposition = (type, id) => {
    if (!mapRef.current) {
        console.error("지도 객체가 초기화되지 않았습니다.");
        return;
    }

    let targetCoordinates = null;

    if (type === "clebine") {
        // Clebine 데이터를 검색
        const clebine = csvData.find((row) => row.ID === id);
        if (clebine && clebine.Latitude && clebine.Longitude) {
            targetCoordinates = new window.kakao.maps.LatLng(
                parseFloat(clebine.Latitude),
                parseFloat(clebine.Longitude)
            );
        } else {
            console.warn(`Clebine ID: ${id}에 해당하는 좌표를 찾을 수 없습니다.`);
        }
    } else if (type === "drone") {
        // Drone 데이터를 검색
        for (const drone of droneData) {
            if (drone.ID === id) {
                const waypoint = drone.waypoints.find((wp) => wp.isItme === "1");
                if (waypoint && waypoint.lat && waypoint.long) {
                    targetCoordinates = new window.kakao.maps.LatLng(
                        parseFloat(waypoint.lat),
                        parseFloat(waypoint.long)
                    );
                    break;
                }
            }
        }
        if (!targetCoordinates) {
            console.warn(`Drone ID: ${id}에 해당하는 좌표를 찾을 수 없습니다.`);
        }
    }

    // 지도 중심 설정
    if (targetCoordinates) {
        mapRef.current.setCenter(targetCoordinates);
        console.log(`지도 중심이 ${type} ID: ${id}의 좌표로 이동되었습니다.`);
    } else {
        console.error(`ID: ${id}에 해당하는 ${type}의 좌표를 찾을 수 없습니다.`);
    }
};


// 지도 확장/축소 토글
const toggleMapSize = () => {
    setIsExpanded((prevState) => !prevState);
    setTimeout(() => {
        if (mapRef.current) {
            mapRef.current.relayout();
            const defaultCenter = new window.kakao.maps.LatLng(35.222172, 126.847596);
            mapRef.current.setCenter(defaultCenter);

            markersRef.current.forEach((marker) => {

                marker.setMap(mapRef.current);
            });
        }
    }, 300);
};

    return (
        <ThemeProvider theme={theme}>
            <div id="mainDiv">
                <header className="header">
                    <a href="https://turbinecrew.co.kr/" target="_blank" rel="noopener noreferrer">
                        <img src={flowDarkImage} alt="Flow" style={{ width: '450px', height: 'auto' }} />
                    </a>
                    <MenuBar />
                </header>

                <hr className="custom_hr" />

                <div className="main-content">
                    <div className="map-section" style={{ position: "relative" }}>
                        <div
                            id="kakaoMap"
                            style={{
                                width: isExpanded ? "100%" : "100%",
                                height: isExpanded ? "100vh" : "400px",
                                transition: "all 0.3s ease",
                            }}
                        ></div>
                        <button
                            onClick={resetMapCenter}
                            style={{
                                position: "absolute",
                                top: "40px",
                                right: "10px",
                                zIndex: 100,
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "8px 16px",
                                cursor: "pointer",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            지도 중심 재설정
                        </button>
                        <button
                            onClick={toggleMapSize}
                            style={{
                                position: "absolute",
                                bottom: "30px",
                                right: "10px",
                                zIndex: 1000,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            <img
                                src={expandIcon}
                                alt="확장 버튼"
                                style={{ width: "40px", height: "40px" }}
                            />
                        </button>
                    </div>

                    <div className="bottom-sections">
                        <div className="clebine-section">
                            <div className="clebine-box" style={{ overflowY: 'scroll', maxHeight: '250px', border: '1px solid #ccc', padding: '20px', paddingTop: '5px' }}>
                                <div style={{flexDirection: "row", display: "flex", gap: "5px"}}>
                                    <h3>Clebine</h3>
                                    {/* Turn On Button */}
                                    <button
                                        onClick={() => turnOnButton("clebine")}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            src={`${process.env.PUBLIC_URL}/on.png`}
                                            alt="Clebine On Button"
                                            style={{ width: "50px", height: "50px" }}
                                        />
                                    </button>

                                    {/* Turn Off Button */}
                                    <button
                                        onClick={() => turnOffButton("clebine")}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            src={`${process.env.PUBLIC_URL}/off.png`}
                                            alt="Clebine Off Button"
                                            style={{ width: "50px", height: "50px" }}
                                        />
                                    </button>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>No</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "25px", paddingRight: "25px"}}>ID</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Power</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Detail</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Reposition</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Visibility</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {csvData.map((row, index) => {
                                            let powerBackgroundColor;

                                            // Power 값에 따라 배경 색상 설정
                                            if (parseFloat(row.Power) === 0) {
                                                powerBackgroundColor = "#141414"; // Red for 0W
                                            } else if (parseFloat(row.Power) >= 1 && parseFloat(row.Power) <= 49) {
                                                powerBackgroundColor = "#941414"; // Light Orange
                                            } else if (parseFloat(row.Power) >= 50 && parseFloat(row.Power) <= 99) {
                                                powerBackgroundColor = "#945D14"; // Light Yellow
                                            } else if (parseFloat(row.Power) >= 100 && parseFloat(row.Power) <= 149) {
                                                powerBackgroundColor = "#949414"; // Light Green
                                            } else if (parseFloat(row.Power) >= 150) {
                                                powerBackgroundColor = "#469446"; // Light Blue
                                            }
                                        return (
                                                <tr key={index}>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.No}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.ID}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px", backgroundColor:powerBackgroundColor }}>{row.Power}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        <button 
                                                            style={{ padding: "5px 10px", cursor: "pointer" }} 
                                                            onClick={() => alert(`Clebine ID: ${row.ID}`)}>
                                                            Detail
                                                        </button>
                                                    </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        <button 
                                                            style={{ padding: "5px 10px", cursor: "pointer" }}
                                                            onClick={() => reposition("clebine", row.ID)}
                                                        >
                                                            Reposition
                                                        </button>
                                                    </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        <button onClick={() => toggleFilterID("clebine", row.ID)}>
                                                            {filterID.includes(`clebine-${row.ID}`) ? "Hide" : "Show"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="smartdrone-section">
                            <div className="clebine-box" style={{ overflowY: 'scroll', maxHeight: '250px', border: '1px solid #ccc', padding: '20px', paddingTop: '5px' }}>
                            <div style={{flexDirection: "row", display: "flex", gap: "5px"}}>
                                <h3>SmartDrone Section</h3>
                                <div style={{ display: "flex", gap: "5px" }}>
                                    {/* Turn On Button */}
                                    <button
                                        onClick={() => turnOnButton("smartDrone")}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            src={`${process.env.PUBLIC_URL}/on.png`}
                                            alt="SmartDrone On Button"
                                            style={{ width: "50px", height: "50px" }}
                                        />
                                    </button>

                                    {/* Turn Off Button */}
                                    <button
                                        onClick={() => turnOffButton("smartDrone")}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            src={`${process.env.PUBLIC_URL}/off.png`}
                                            alt="SmartDrone Off Button"
                                            style={{ width: "50px", height: "50px" }}
                                        />
                                    </button>
                                </div>
                            </div>

                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>ID</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Status</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Detail</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Reposition</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Visibility</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {droneData.map((drone) => (
                                            drone.waypoints
                                                .filter((wp) => wp.isItme === "1")
                                                .map((wp, idx) => (
                                                    <tr key={`${drone.ID}-${idx}`}>
                                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{drone.ID}</td>
                                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                            {(() => {
                                                                switch (wp.action) {
                                                                    case "5":
                                                                        return "이륙";
                                                                    case "6":
                                                                        return "착륙";
                                                                    case "16":
                                                                        return "이동";
                                                                    default:
                                                                        return wp.action;
                                                                }
                                                            })()}
                                                        </td>
                                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                            <button 
                                                                style={{ padding: "5px 10px", cursor: "pointer" }} 
                                                                onClick={() => alert(`SmartDrone ID: ${drone.ID}`)}>
                                                                Detail
                                                            </button>
                                                        </td>
                                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                            <button 
                                                                style={{ padding: "5px 10px", cursor: "pointer" }}
                                                                onClick={() => reposition("drone", drone.ID)}
                                                            >
                                                                Reposition
                                                            </button>
                                                        </td>
                                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                            <button onClick={() => toggleFilterID("drone", drone.ID)}>
                                                                {filterID.includes(`drone-${drone.ID}`) ? "Hide" : "Show"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <ThemeToggle />
            </div>
        </ThemeProvider>
    );
}

export default Main;