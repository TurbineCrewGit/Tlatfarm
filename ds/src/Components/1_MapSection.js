import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import Marker from "./1_Marker";
import { KAKAO_MAP_APPKEY } from "./constants";
import Icon0w from "../Styles/image/0w.png";
import Icon0_49w from "../Styles/image/0_49w.png";
import Icon50_100w from "../Styles/image/50_100w.png";
import Icon100_150w from "../Styles/image/100_150w.png";
import Icon150_200w from "../Styles/image/150_200w.png";
import movingDroneIcon from "../Styles/image/이동중.gif";
import chargingDroneIcon from "../Styles/image/충전중.gif";
import expandIcon from "../Styles/image/expand_button.png";
import centerIcon from "../Styles/images/centerOfMap.png";

import "../Styles/1_MapSection.css";

const MapSection = forwardRef(({ smartPoleData, droneData, filterID, isDarkMode }, ref) => {
    const mapRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

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

    const resetMapCenter = () => {
        if (!mapRef.current) {
            console.error("지도 객체가 초기화되지 않았습니다.");
            return;
        }
        const defaultCenter = new window.kakao.maps.LatLng(35.222172, 126.847596);
        mapRef.current.panTo(defaultCenter);
        console.log("지도 중심 재설정 완료.");
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

    const getClebineImageSrc = (power) => {
        if (power === 0) return Icon0w;
        if (power >= 1 && power <= 49) return Icon0_49w;
        if (power >= 50 && power <= 99) return Icon50_100w;
        if (power >= 100 && power <= 149) return Icon100_150w;
        if (power >= 150) return Icon150_200w;
        return Icon0w; // Default image
    };

    useEffect(() => {
        const cleanUpScript = loadKakaoMapScript();
        return () => {
            if (cleanUpScript) cleanUpScript();
        };
    }, []);

    return (
        <div className="map-section" style={{ position: "relative" }}>
            <div
                id="kakaoMap"
                style={{
                    width: "100%",
                    height: isExpanded ? "100vh" : "400px",
                }}
            ></div>

            <div className="map-filter"
                style={{
                    pointerEvents: "none",
                    borderRadius: "8px",
                    width: "100%",
                    height: isExpanded ? "100vh" : "400px",
                    transition: "all 0.3s ease",
                }}
            ></div>

            {/* 지도 중심 버튼 */}
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
                    src={centerIcon}
                    alt="중심 버튼"
                    style={{ width: "30px", height: "30px" }}
                />
            </button>

            {/* 지도 크기 확장 버튼 */}
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

            {/* 스마트폴 마커 */}
            {isMapLoaded &&
                smartPoleData.map((row) => (
                    <Marker
                        key={`clebine-${row.id}`}
                        type="clebine"
                        lat={parseFloat(row.latitude)}
                        lng={parseFloat(row.longitude)}
                        imageSrc={getClebineImageSrc(parseFloat(row.powerProduction))}
                        tooltipContent={`<p><strong>ID:</strong> ${row.id}</p><p><strong>Power:</strong> ${row.powerProduction}</p>`}
                        map={mapRef.current}
                        isVisible={filterID.includes(`clebine-${row.id}`)}
                    />
                ))}

            {/* 드론 마커 */}
            {isMapLoaded &&
                droneData.map((drone) => (
                    <Marker
                        key={`drone-${drone.droneId}`}
                        type="drone"
                        lat={parseFloat(drone.latitude)}
                        lng={parseFloat(drone.longitude)}
                        imageSrc={drone.action === "16" ? movingDroneIcon : chargingDroneIcon}
                        tooltipContent={`<p><strong>ID:</strong> ${drone.droneId}</p><p><strong>Status:</strong> ${
                            drone.action === "16"
                                ? "이동 중"
                                : drone.action === "5"
                                ? "이륙"
                                : drone.action === "6"
                                ? "착륙"
                                : "충전 중"
                        }</p>`}
                        map={mapRef.current}
                        isVisible={filterID.includes(`drone-${drone.droneId}`)}
                    />
                ))}
        </div>
    );
});

export default MapSection;
