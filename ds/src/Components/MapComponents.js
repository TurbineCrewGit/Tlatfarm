// src/MapComponent.js
import React, { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { KAKAO_MAP_APPKEY } from './constants';
import "../Styles/App.css";
import center from "../Styles/images/centerOfMap.png"

const MapComponent = forwardRef(({ addMarker, coordinates, markersRef, mapRef, isMapOpen, setIsMapOpen }, ref) => {


  const polylineRef = React.useRef(null); // 폴리라인 참조
  const distanceLabelsRef = React.useRef([]); // 거리 레이블 참조



  // 지도 위치 초기화 함수
  const resetMapPosition = useCallback(() => {
    // 지도 중심을 기본값으로 설정
    if (mapRef.current) {
      const defaultCenter = new window.kakao.maps.LatLng(35.222172, 126.847596); // 기본 중심 좌표
      mapRef.current.setCenter(defaultCenter);
    }
  }, [mapRef]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APPKEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('kakaoMap');
        const options = {
          center: new window.kakao.maps.LatLng(35.222172, 126.847596),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        mapRef.current = map;

        window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
          const latlng = mouseEvent.latLng;
          addMarker(latlng); // 마커 추가
        });
      });
    };

    script.onerror = () => {
      console.error('Kakao Maps 스크립트 로드 실패.');
      alert('지도 로드에 실패했습니다. 나중에 다시 시도해주세요.');
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [addMarker, mapRef]);


  useEffect(() => {
    // 기존 폴리라인 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // 기존 거리 레이블 제거
    distanceLabelsRef.current.forEach((label) => label.setMap(null));
    distanceLabelsRef.current = [];

    // 새로운 폴리라인 생성
    const path = coordinates.map((coord) => new window.kakao.maps.LatLng(coord.lat, coord.lng));
    if (path.length > 0) {
      polylineRef.current = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 10,
        strokeColor: '#72BF44',
        strokeOpacity: 1,
        strokeStyle: 'solid',
      });
      polylineRef.current.setMap(mapRef.current);
    }

    // 거리 레이블 추가
    for (let i = 0; i < coordinates.length - 1; i++) {
      const coord1 = coordinates[i];
      const coord2 = coordinates[i + 1];
      const distance = calculate3DDistance(coord1, coord2);
      const midpoint = calculateMidpoint(coord1, coord2);

      // 거리 레이블 내용 생성
      const content = `
        <div class="distance-label">
          ${distance < 1000 ? `${distance.toFixed(1)} m` : `${(distance / 1000).toFixed(2)} km`}
        </div>
      `;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(midpoint.lat, midpoint.lng),
        content,
        map: mapRef.current,
        xAnchor: 0.5,
        yAnchor: 1.0,
      });

      distanceLabelsRef.current.push(customOverlay);
    }
  }, [coordinates]);

  // 지도 열기/닫기 토글 함수
  const toggleMap = () => {
    setIsMapOpen(prevState => {
      const newState = !prevState;
      if (newState && mapRef.current) {
        setTimeout(() => {
          mapRef.current.relayout();
          mapRef.current.setCenter(new window.kakao.maps.LatLng(35.222172, 126.847596));
        }, 0);
      }
      return newState;
    });
  };

  // 거리 계산 함수
  const calculate3DDistance = useCallback((coord1, coord2) => {
    const R = 6371e3;
    const lat1Rad = (coord1.lat * Math.PI) / 180;
    const lat2Rad = (coord2.lat * Math.PI) / 180;
    const deltaLatRad = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const deltaLngRad = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const horizontalDistance = R * c;

    const verticalDistance = Math.abs(coord2.alt - coord1.alt);

    return Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);
  }, []);

  const calculateTotalDistance = useCallback(
    (coords) => {
      let total = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        total += calculate3DDistance(coords[i], coords[i + 1]);
      }
      return total;
    },
    [calculate3DDistance]
  );

  useImperativeHandle(ref, () => ({
    resetMapPosition,
    calculateTotalDistance, // 외부에서 호출 가능
  }));

  // 중간 지점 계산 함수
  const calculateMidpoint = (coord1, coord2) => {
    const lat1Rad = (coord1.lat * Math.PI) / 180;
    const lng1Rad = (coord1.lng * Math.PI) / 180;
    const lat2Rad = (coord2.lat * Math.PI) / 180;
    const lng2Rad = (coord2.lng * Math.PI) / 180;

    const dLng = lng2Rad - lng1Rad;

    const Bx = Math.cos(lat2Rad) * Math.cos(dLng);
    const By = Math.cos(lat2Rad) * Math.sin(dLng);

    const latMidRad = Math.atan2(
      Math.sin(lat1Rad) + Math.sin(lat2Rad),
      Math.sqrt((Math.cos(lat1Rad) + Bx) ** 2 + By ** 2)
    );
    const lngMidRad = lng1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);

    return {
      lat: (latMidRad * 180) / Math.PI,
      lng: (lngMidRad * 180) / Math.PI,
      alt: (coord1.alt + coord2.alt) / 2,
    };
  };

  return (
    <div className='mapComponentsBox'>
      {/* 지도 열기/닫기 버튼 */}
      <div>
        <button
          className="btn-toggle-map"
          onClick={toggleMap}
          aria-expanded={isMapOpen}
          aria-controls="kakaoMap"
        >
          {isMapOpen ? '지도 접기' : '지도 펼치기'}
        </button>
      </div>

      {/* 지도 */}
      <div id="map-box" className={`map-container ${isMapOpen ? 'open' : 'closed'}`}>
        <div className='mapFilter'></div>
        <div id="kakaoMap"></div>
          <img src={center} className="reset-map-position" onClick={resetMapPosition}/>
      </div>
    </div>
  );
});

export default MapComponent;
