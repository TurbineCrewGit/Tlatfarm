import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { KAKAO_MAP_APPKEY } from "./constants";
import expandIcon from "../Styles/image/expand_button.png";
import movingDroneIcon from "../Styles/image/이동중.gif";
import chargingDroneIcon from "../Styles/image/충전중.gif";
import Icon0w from "../Styles/image/0w.png";
import Icon0_49w from "../Styles/image/0_49w.png";
import Icon50_100w from "../Styles/image/50_100w.png";
import Icon100_150w from "../Styles/image/100_150w.png";
import Icon150_200w from "../Styles/image/150_200w.png";
import center from "../Styles/images/centerOfMap.png"

import "../Styles/1_MapSection.css";

const MapSection =forwardRef(({ csvData, droneData, filterID, isDarkMode},ref) => {
    const mapRef = useRef(null); // 지도 객체 참조
    const markersRef = useRef([]); // 마커 객체 참조
    const customOverlayRef = useRef([]); // Custom Overlay 객체 참조
    const [isExpanded, setIsExpanded] = useState(false); // 확장 상태
    const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태


    // 지도 초기화 함수
    const initializeMap = () => {
        const container = document.getElementById("kakaoMap");
        const options = {
            center: new window.kakao.maps.LatLng(35.222172, 126.847596),
            level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        mapRef.current = map;
        setIsMapLoaded(true);
        console.log("카카오맵 초기화 완료");
    };

    // Kakao Map 스크립트 로드 함수
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

    // 지도 확장/축소 토글 함수
    const toggleMapSize = () => {
        setIsExpanded((prev) => !prev);
        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.relayout();
                mapRef.current.setCenter(new window.kakao.maps.LatLng(35.222172, 126.847596));
            }
        }, 300);
    };

    // 지도 중심 재설정 함수
    const resetMapCenter = () => {
        if (!mapRef.current) {
            console.error("지도 객체가 초기화되지 않았습니다.");
            return;
        }
        const defaultCenter = new window.kakao.maps.LatLng(35.222172, 126.847596);
        mapRef.current.panTo(defaultCenter);
        console.log("지도 중심 재설정 완료.");
    };

    // Reposition 기능
    const reposition = (type, id) => {
        if (!mapRef.current) {
            console.error("지도 객체가 초기화되지 않았습니다.");
            return;
        }

        let targetCoordinates = null;

        if (type === "clebine") {
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

        if (targetCoordinates) {
            mapRef.current.setCenter(targetCoordinates);
            console.log(`지도 중심이 ${type} ID: ${id}의 좌표로 이동되었습니다.`);
        } else {
            console.error(`ID: ${id}에 해당하는 ${type}의 좌표를 찾을 수 없습니다.`);
        }
    };

    // `useImperativeHandle`로 `reposition` 함수 노출
    useImperativeHandle(ref, () => ({
        reposition,
    }));

    // Clebine 마커 추가
    useEffect(() => {
        if (!isMapLoaded || csvData.length === 0) return;

        const addClebineMarkers = () => {
            csvData.forEach((row) => {
                const targetID = `clebine-${row.ID}`;
                if (!filterID.includes(targetID)) return;
        
                const lat = parseFloat(row.Latitude);
                const lng = parseFloat(row.Longitude);
                const power = parseFloat(row.Power);
        
                if (!isNaN(lat) && !isNaN(lng)) {
                    let markerImageSrc;
                    if (power === 0) {
                        markerImageSrc = Icon0w;
                    } else if (power >= 1 && power <= 49) {
                        markerImageSrc = Icon0_49w;
                    } else if (power >= 50 && power <= 99) {
                        markerImageSrc = Icon50_100w;
                    } else if (power >= 100 && power <= 149) {
                        markerImageSrc = Icon100_150w;
                    } else if (power >= 150) {
                        markerImageSrc = Icon150_200w;
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
        
                    const dotOverlay = new window.kakao.maps.CustomOverlay({
                        position: new window.kakao.maps.LatLng(lat, lng),
                        content: '<div style="width: 6px; height: 6px; background-color: red; border-radius: 50%; position: absolute; transform: translate(-50%, -50%); z-index: 2;"></div>',
                        zIndex: 2,
                    });
        
                    // Tooltip 생성
                    const tooltipContent = `
                        <div class="map-tooltip">
                            <p><strong>ID:</strong> ${row.ID}</p>
                            <p><strong>Power:</strong> ${row.Power}</p>
                        </div>
                    `;
        
                    const tooltipOverlay = new window.kakao.maps.CustomOverlay({
                        position: new window.kakao.maps.LatLng(lat, lng),
                        content: tooltipContent,
                        yAnchor: 2.0,
                        xAnchor: 0.5,
                        zIndex: 6,
                        map: null, // 초기에는 표시하지 않음
                    });
        
                    // 마커 hover 이벤트
                    window.kakao.maps.event.addListener(marker, "mouseover", () => {
                        tooltipOverlay.setMap(mapRef.current);
                        marker.setImage(hoverImage);
                    });
        
                    window.kakao.maps.event.addListener(marker, "mouseout", () => {
                        tooltipOverlay.setMap(null);
                        marker.setImage(markerImage);
                    });
        
                    dotOverlay.setMap(mapRef.current);
        
                    markersRef.current.push(marker);
                    customOverlayRef.current.push(dotOverlay);
                }
            });
        };
        

        addClebineMarkers();

        return () => {
            markersRef.current.forEach((marker) => marker.setMap(null));
            markersRef.current = [];
            customOverlayRef.current.forEach((overlay) => overlay.setMap(null));
            customOverlayRef.current = [];
        };
    }, [isMapLoaded, csvData, filterID]);

    // SmartDrone 마커 추가
    useEffect(() => {
        if (!isMapLoaded) return;

        const addDroneMarkers = () => {
            droneData.forEach((drone) => {
                const targetID = `drone-${drone.droneId}`;
                if (!filterID.includes(targetID)) return; // filterID에 포함되지 않으면 처리하지 않음

                const lat = parseFloat(drone.latitude);
                const lng = parseFloat(drone.longitude);

                if (!isNaN(lat) && !isNaN(lng)) {
                    const markerImage = new window.kakao.maps.MarkerImage(
                        drone.action === "16" ? movingDroneIcon : chargingDroneIcon,
                        new window.kakao.maps.Size(65, 65),
                        { offset: new window.kakao.maps.Point(32.5, 32.5) }
                    );

                    const hoverImage = new window.kakao.maps.MarkerImage(
                        drone.action === "16" ? movingDroneIcon : chargingDroneIcon,
                        new window.kakao.maps.Size(80, 80),
                        { offset: new window.kakao.maps.Point(40, 40) }
                    );

                    const marker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(lat, lng),
                        map: mapRef.current,
                        image: markerImage,
                        zIndex: 4,
                    });

                    // Tooltip 생성
                    const tooltipContent = `
                        <div class="map-tooltip">
                            <p><strong>ID:</strong> ${drone.droneId}</p>
                            <p><strong>Status:</strong> ${
                                drone.action === "16"
                                    ? "이동 중"
                                    : drone.action === "5"
                                    ? "이륙"
                                    : drone.action === "6"
                                    ? "착륙"
                                    : "충전 중"
                            }</p>
                        </div>
                    `;

                    const tooltipOverlay = new window.kakao.maps.CustomOverlay({
                        position: new window.kakao.maps.LatLng(lat, lng),
                        content: tooltipContent,
                        yAnchor: 1.6,
                        xAnchor: 0.5,
                        zIndex: 6,
                        map: null, // 초기에는 표시하지 않음
                    });

                    // 마커 hover 이벤트
                    window.kakao.maps.event.addListener(marker, "mouseover", () => {
                        tooltipOverlay.setMap(mapRef.current);
                        marker.setImage(hoverImage);
                    });

                    window.kakao.maps.event.addListener(marker, "mouseout", () => {
                        tooltipOverlay.setMap(null);
                        marker.setImage(markerImage);
                    });

                    markersRef.current.push(marker);
                }
            });
        };

        addDroneMarkers();

        return () => {
            markersRef.current.forEach((marker) => marker.setMap(null));
            markersRef.current = [];
        };
    }, [isMapLoaded, droneData, filterID]);



    // Kakao Map 스크립트 로드 처리
    useEffect(() => {
        const cleanUpScript = loadKakaoMapScript();
        return () => {
            if (cleanUpScript) cleanUpScript();
        };
    }, []);

    return (
        <div className="map-section" style={{position: "relative"}}>
            <div className="map-container">
                <div className="map-filter"
                    style={{
                        pointerEvents: "none",
                        borderRadius: "8px",
                        width: "100%",
                        height: isExpanded ? "100vh" : "400px",
                        transition: "all 0.3s ease",
                    }}
                ></div>
                <div
                    id="kakaoMap"
                    style={{
                        width: isExpanded ? "100%" : "100%",
                        height: isExpanded ? "100vh" : "400px",
                        transition: "all 0.3s ease",
                    }}
                ></div>
            </div>

            

            <button
                onClick={resetMapCenter}
                style={{
                    position: "absolute",
                    top: "40px",
                    right: "10px",
                    zIndex: isDarkMode ? 1000:100,
                    backgroundColor: isDarkMode?"rgba(138, 138, 138, 0.8)":"rgba(255, 255, 255, 0.8)",
                    border: isDarkMode? "1px solid #8d8d8d":"1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px",
                    paddingTop: "8px",
                    paddingBottom: "3px",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                }}
            >
                <img
                    src={center}
                    alt="중심 버튼"
                    style={{ width: "30px", height: "30px" }}
                />
            </button>

            <button
                onClick={toggleMapSize}
                style={{
                    position: "absolute",
                    bottom: "30px",
                    right: "10px",
                    zIndex: 1000,
                    backgroundColor: isDarkMode?"rgba(138, 138, 138, 0.8)":"rgba(255, 255, 255, 0.8)",
                    border: isDarkMode? "1px solid #8d8d8d":"1px solid #ccc",
                    borderRadius: "20%",
                    paddingTop: "5px",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                }}
            >
                <img
                    src={expandIcon}
                    alt="확장 버튼"
                    style={{ width: "30px", height: "30px" }}
                />
            </button>
        </div>
    );
});

export default MapSection;
