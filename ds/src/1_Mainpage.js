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
    const [csvData, setCsvData] = useState([]); // CSV 데이터 저장
    const [droneData, setDroneData] = useState([]); // 드론 데이터 저장
    const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태
    const [isExpanded, setIsExpanded] = useState(false); // 확장 상태

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

// SmartDrone 데이터 로드
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

            // 지도에 드론 마커 추가
            if (isMapLoaded) {
                allData.forEach((drone) => {
                    drone.waypoints
                        .filter((wp) => wp.isItme === "1")
                        .forEach((wp) => {
                            const lat = parseFloat(wp.lat);
                            const lng = parseFloat(wp.long);

                            // Clebine 데이터와 중복 좌표인지 확인
                            const isOverlapping = csvData.some(row => 
                                parseFloat(row.Latitude) === lat && parseFloat(row.Longitude) === lng
                            );

                            // 오프셋 적용
                            const adjustedLat = isOverlapping ? lat + 0.0001 : lat;
                            const adjustedLng = isOverlapping ? lng + 0.0001 : lng;

                            if (!isNaN(lat) && !isNaN(lng)) {
                                // 드론 상태에 따른 마커 이미지 설정
                                const markerImage = new window.kakao.maps.MarkerImage(
                                    wp.action === "6" // 착륙 상태라면 "충전중.gif", 그 외에는 "이동중.gif"
                                        ? `${process.env.PUBLIC_URL}/충전중.gif`
                                        : `${process.env.PUBLIC_URL}/이동중.gif`,
                                    wp.action === "6"
                                        ? new window.kakao.maps.Size(80, 80)
                                        : new window.kakao.maps.Size(65, 65)
                                );

                                const hoverImage = new window.kakao.maps.MarkerImage(
                                    wp.action === "6" // 착륙 상태라면 "충전중.gif", 그 외에는 "이동중.gif"
                                        ? `${process.env.PUBLIC_URL}/충전중.gif`
                                        : `${process.env.PUBLIC_URL}/이동중.gif`,
                                    wp.action === "6"
                                        ? new window.kakao.maps.Size(90, 90)
                                        : new window.kakao.maps.Size(70, 70)
                                );

                                const marker = new window.kakao.maps.Marker({
                                    position: new window.kakao.maps.LatLng(adjustedLat, adjustedLng),
                                    map: mapRef.current,
                                    image: markerImage,
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
            }
        } catch (error) {
            console.error("드론 데이터 로드 오류:", error);
        }
    };

    loadDroneData();
}, [isMapLoaded]);


// 지도 로드 후 Clebine 마커 추가
useEffect(() => {
    if (!isMapLoaded || csvData.length === 0) return;

    const addMarkers = () => {
        csvData.forEach((row) => {
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
                    });

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
                }
            }
        });
        console.log("모든 Clebine 마커 추가 완료.");
    };

    addMarkers();

    return () => {
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
    };
}, [isMapLoaded, csvData]);


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
                                zIndex: 1000,
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
                            <h3>Clebine Section</h3>
                            <div className="clebine-box" style={{ overflowY: 'scroll', maxHeight: '200px', border: '1px solid #ccc', padding: '20px' }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>No</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "25px", paddingRight: "25px"}}>ID</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Power</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {csvData.map((row, index) => (
                                            <tr key={index}>
                                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.No}</td>
                                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.ID}</td>
                                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.Power}</td>
                                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                    <button 
                                                        style={{ padding: "5px 10px", cursor: "pointer" }} 
                                                        onClick={() => alert(`Clebine ID: ${row.ID}`)}>
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="smartdrone-section">
                            <h3>SmartDrone Section</h3>
                            <div className="clebine-box" style={{ overflowY: 'scroll', maxHeight: '200px', border: '1px solid #ccc', padding: '20px' }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>ID</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Status</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" , paddingLeft: "20px", paddingRight: "20px"}}>Detail</th>
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