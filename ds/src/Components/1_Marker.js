import React, { useEffect, useState } from "react";

const Marker = ({ type, lat, lng, imageSrc, tooltipContent, map, isVisible }) => {
    const [overlay, setOverlay] = useState(null);

    useEffect(() => {
        // 마커 HTML 요소 생성
        const content = document.createElement("div");
        content.style.position = "relative";
        content.className = isVisible ? "marker-popin" : "marker-popout";

        const image = document.createElement("img");
        image.src = imageSrc;
        image.alt = type === "clebine" ? "clebine marker" : "drone marker";
        image.style.width = type === "clebine" ? "60px" : "50px";
        image.style.height = type === "clebine" ? "70px" : "50px";

        content.appendChild(image);

        // 툴팁 생성
        const tooltip = document.createElement("div");
        tooltip.className = "map-tooltip";
        tooltip.innerHTML = tooltipContent;
        tooltip.style.position = "absolute";
        tooltip.style.top = "0";
        tooltip.style.left = "0";
        tooltip.style.transform = "translate(-15%, -100%)";
        tooltip.style.display = "none";
        tooltip.style.zIndex = "1";

        content.appendChild(tooltip);

        // Hover 이벤트 추가
        content.addEventListener("mouseover", () => {
            image.style.transform = "scale(1.1)";
            tooltip.style.display = "block";
        });

        content.addEventListener("mouseout", () => {
            
            image.style.transform = "scale(1.0)";
            tooltip.style.display = "none";
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

        // Kakao CustomOverlay 생성
        const customOverlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(lat, lng),
            content,
            yAnchor: type === "clebine" ? 1.0 : 0.55,
            xAnchor: 0.5,
            zIndex: 3,
        });

        if (isVisible) {
            customOverlay.setMap(map); // 마커 표시
        } else {
            content.addEventListener("animationend", () => {
                customOverlay.setMap(null); // 애니메이션 종료 후 제거
            });
            customOverlay.setMap(map); // 팝아웃 애니메이션 재생
        }

        setOverlay(customOverlay);

        return () => {
            customOverlay.setMap(null); // Cleanup
        };
    }, [type, lat, lng, imageSrc, tooltipContent, map, isVisible]);

    return null; // React에서 렌더링할 내용은 없음
};

export default Marker;
