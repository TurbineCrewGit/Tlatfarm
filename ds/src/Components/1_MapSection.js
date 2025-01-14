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
import center from "../Styles/images/centerOfMap.png";

import "../Styles/1_MapSection.css";

const MapSection = forwardRef(({ smartPoleData, droneData, filterID, isDarkMode }, ref) => {
    const mapRef = useRef(null);
    const customOverlayRef = useRef(new Map()); // Map으로 변경
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

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

    const toggleMapSize = () => {
        setIsExpanded((prev) => !prev);
        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.relayout();
                mapRef.current.setCenter(new window.kakao.maps.LatLng(35.222172, 126.847596));
            }
        }, 300);
    };

    const resetMapCenter = () => {
        if (!mapRef.current) {
            console.error("지도 객체가 초기화되지 않았습니다.");
            return;
        }
        const defaultCenter = new window.kakao.maps.LatLng(35.222172, 126.847596);
        mapRef.current.panTo(defaultCenter);
        console.log("지도 중심 재설정 완료.");
    };

    const reposition = (type, id) => {
        if (!mapRef.current) {
            console.error("지도 객체가 초기화되지 않았습니다.");
            return;
        }

        let targetCoordinates = null;

        if (type === "clebine") {
            const clebine = smartPoleData.find((row) => row.id === id);
            if (clebine && clebine.latitude && clebine.longitude) {
                targetCoordinates = new window.kakao.maps.LatLng(
                    parseFloat(clebine.latitude),
                    parseFloat(clebine.longitude)
                );
            } else {
                console.warn(`Clebine ID: ${id}에 해당하는 좌표를 찾을 수 없습니다.`);
            }
        } else if (type === "drone") {
            for (const drone of droneData) {
                if (drone.droneId === id) {
                    const lat = parseFloat(drone.latitude);
                    const lng = parseFloat(drone.longitude);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        targetCoordinates = new window.kakao.maps.LatLng(lat, lng);
                        break;
                    } else {
                        console.warn(`Drone ID: ${id}에 대한 유효한 좌표가 없습니다.`);
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

    useImperativeHandle(ref, () => ({
        reposition,
    }));

    const createMarkerWithAnimation = (type, lat, lng, imageSrc, targetID, tooltipContent) => {
        const content = document.createElement("div");
        content.style.position = "relative";
        content.className = "marker-popin"; // 생성 시 pop-in 애니메이션 적용
    
        const image = document.createElement("img");
        image.src = imageSrc;
        image.alt = "marker";
        if(type === "clebine"){
            image.style.width = "60px";
            image.style.height = "70px";
        }else if(type === "drone"){
            image.style.width = "60px";
            image.style.height = "60px";
        }
        image.style.transition = "transform 0.3s ease";
    
        const tooltip = document.createElement("div");
        tooltip.className = "map-tooltip";
        tooltip.innerHTML = tooltipContent;
        tooltip.style.position = "absolute";
        tooltip.style.top = "0";
        tooltip.style.left = "0";
        tooltip.style.transform = "translate(-15%, -100%)";
        tooltip.style.zIndex = "1";
        tooltip.style.display = "none";
    
        // Hover 이벤트 추가
        content.addEventListener("mouseover", () => {
            image.style.transform = "scale(1.1)";
            tooltip.style.display = "block";
        });
    
        content.addEventListener("mouseout", () => {
            image.style.transform = "scale(1.0)";
            tooltip.style.display = "none";
        });
    
        content.appendChild(image);
        content.appendChild(tooltip);
    
        // 애니메이션 종료 후 클래스 제거
        content.addEventListener("animationend", () => {
            if (content.classList.contains("marker-popin")) {
                content.classList.remove("marker-popin"); // 팝인 클래스 제거
            }
        });

        if(type === "clebine"){
            // Dot 생성 및 추가
            const dot = document.createElement("div");
            dot.style.width = "4px";
            dot.style.height = "4px";
            dot.style.backgroundColor = "red";
            dot.style.borderRadius = "100%";
            dot.style.position = "absolute";
            dot.style.bottom = "0";
            dot.style.left = "50%";
            dot.style.transform = "translate(-50%, -50%)";
            content.appendChild(dot);
        }
    
        const customOverlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(lat, lng),
            content,
            yAnchor: type === "clebine" ? 1.0 : 0.55,
            xAnchor: 0.5,
            zIndex: 3,
        });
    
        customOverlay.setMap(mapRef.current);
        customOverlayRef.current.set(targetID, customOverlay);
    };
    

    const removeMarkerWithAnimation = (targetID) => {
        const overlay = customOverlayRef.current.get(targetID);
    
        if (!overlay) return;
    
        const content = overlay.getContent();
        if (content) {
            content.classList.add("marker-popout"); // 팝아웃 애니메이션 추가
    
            content.addEventListener("animationend", () => {
                overlay.setMap(null); // 지도에서 제거
                customOverlayRef.current.delete(targetID); // 마커 상태 제거
            });
        }
    };
    

    useEffect(() => {
        if (!isMapLoaded || smartPoleData.length === 0) return;

        const updateOrAddCustomOverlays = () => {
            smartPoleData.forEach((row) => {
                const targetID = `clebine-${row.id}`;
                const lat = parseFloat(row.latitude);
                const lng = parseFloat(row.longitude);
                const power = parseFloat(row.powerProduction);

        
                if (!filterID.includes(targetID)) {
                    // 마커 제거
                    removeMarkerWithAnimation(targetID);
                    return;
                }
        
                if (!isNaN(lat) && !isNaN(lng)) {
                    let imageSrc;
                    if (power === 0) {
                        imageSrc = Icon0w;
                    } else if (power >= 1 && power <= 49) {
                        imageSrc = Icon0_49w;
                    } else if (power >= 50 && power <= 99) {
                        imageSrc = Icon50_100w;
                    } else if (power >= 100 && power <= 149) {
                        imageSrc = Icon100_150w;
                    } else if (power >= 150) {
                        imageSrc = Icon150_200w;
                    }

//                    console.log("현재 customOverlay: ", customOverlayRef.current);
        
                    if (customOverlayRef.current.has(targetID)) {
                        // 이미 존재하는 마커 → 위치만 업데이트 (애니메이션 재생 X)
                        console.log(targetID, ": 마커 업데이트");
                        const overlay = customOverlayRef.current.get(targetID);
                        overlay.setPosition(new window.kakao.maps.LatLng(lat, lng));
                    } else {
                        // 새로운 마커 → 팝인 애니메이션 추가
                        console.log(targetID, ": 마커 추가");
                        createMarkerWithAnimation(
                            "clebine",
                            parseFloat(row.latitude),
                            parseFloat(row.longitude),
                            imageSrc,
                            targetID,
                            `<p><strong>ID:</strong> ${row.id}</p><p><strong>Power:</strong> ${row.powerProduction}</p>`
                        );
                    }
                }
            });
        };
        

        updateOrAddCustomOverlays();

        return () => {
            /*
            customOverlayRef.current.forEach((overlay) => {
                overlay.setMap(null);
            });
            customOverlayRef.current.clear(); */
        };
    }, [isMapLoaded, smartPoleData, filterID]);

    useEffect(() => {
        if (!isMapLoaded || droneData.length === 0) return;

        const addDroneOverlays = () => {
            droneData.forEach((drone) => {
                const targetID = `drone-${drone.droneId}`;
                const lat = parseFloat(drone.latitude);
                const lng = parseFloat(drone.longitude);
        
                // 필터링된 ID가 아니면 마커 제거
                if (!filterID.includes(targetID)) {
                    removeMarkerWithAnimation(targetID); // 마커 제거
                    return;
                }
        
                // 유효한 좌표인지 확인
                if (!isNaN(lat) && !isNaN(lng)) {
                    const imageSrc = drone.action === "16" ? movingDroneIcon : chargingDroneIcon;
        
                    if (customOverlayRef.current.has(targetID)) {
                        // 이미 존재하는 마커 → 위치만 업데이트
                        const overlay = customOverlayRef.current.get(targetID);
                        overlay.setPosition(new window.kakao.maps.LatLng(lat, lng));
                        console.log(targetID, ": 마커 업데이트");
                    } else {
                        // 새로 추가되는 마커 → 팝인 애니메이션
                        createMarkerWithAnimation(
                            "drone",
                            lat,
                            lng,
                            imageSrc,
                            targetID,
                            `<p><strong>ID:</strong> ${drone.droneId}</p><p><strong>Status:</strong> ${
                                drone.action === "16"
                                    ? "이동 중"
                                    : drone.action === "5"
                                    ? "이륙"
                                    : drone.action === "6"
                                    ? "착륙"
                                    : "충전 중"
                            }</p>`
                        );
                        console.log(targetID, ": 마커 추가");
                    }
                }
            });
        };
        

        addDroneOverlays();

        return () => {
            /*
            customOverlayRef.current.forEach((overlay) => {
                overlay.setMap(null);
            });
            customOverlayRef.current.clear(); */
        };
    }, [isMapLoaded, droneData, filterID]);

    useEffect(() => {
        const cleanUpScript = loadKakaoMapScript();
        return () => {
            if (cleanUpScript) cleanUpScript();
        };
    }, []);

    return (
        <div className="map-section" style={{ position: "relative" }}>
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
                    zIndex: isDarkMode ? 1000 : 100,
                    backgroundColor: isDarkMode ? "rgba(138, 138, 138, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    border: isDarkMode ? "1px solid #8d8d8d" : "1px solid #ccc",
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
                    backgroundColor: isDarkMode ? "rgba(138, 138, 138, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    border: isDarkMode ? "1px solid #8d8d8d" : "1px solid #ccc",
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