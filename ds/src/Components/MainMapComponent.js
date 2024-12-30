import React, { useEffect, useRef } from 'react';
import { KAKAO_MAP_APPKEY } from './constants';

const MainMapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const loadKakaoMap = () => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APPKEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        initializeMap();
      });
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    try {
      if (!window.kakao || !window.kakao.maps) {
        throw new Error('Kakao Maps API가 로드되지 않았습니다.');
      }

      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(35.222172, 126.847596), // 초기 중심 좌표
        level: 3 // 초기 확대 수준
      };

      // 이미 맵 인스턴스가 있다면 제거
      if (mapInstance.current) {
        mapInstance.current = null;
      }

      const map = new window.kakao.maps.Map(container, options);
      mapInstance.current = map;

      // 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      const mapTypeControl = new window.kakao.maps.MapTypeControl();

      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    loadKakaoMap();
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: '80%',
        height: '500px', // 원하는 높이로 조정
        margin: '20px auto',
        // borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default MainMapComponent;
