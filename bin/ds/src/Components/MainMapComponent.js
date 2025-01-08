import React, { useEffect, useRef, useState } from 'react';
import { KAKAO_MAP_APPKEY } from './constants';
import '../Styles/MainMap.css'; // CSS 파일 import

const MainMapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [markers, setMarkers] = useState([]); // 마커 상태 추가

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

      // 지도 클릭 이벤트 추가
      window.kakao.maps.event.addListener(map, 'click', (event) => {
        const lat = event.latLng.getLat();
        const lng = event.latLng.getLng();
        addMapMarker(lat, lng); // 지도에 마커 추가
      });
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error);
    }
  };

  // 지도에 마커 추가하는 함수
  const addMapMarker = (lat, lng) => {
    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition
    });
    marker.setMap(mapInstance.current); // 지도에 마커 표시

    // 마커 클릭 이벤트 추가
    window.kakao.maps.event.addListener(marker, 'click', () => {
      removeMapMarker(marker); // 마커 클릭 시 삭제
    });

    // 마커 상태 업데이트
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      { id: prevMarkers.length + 1, lat, lng, marker } // 마커 객체도 상태에 저장
    ]);
  };

  // 지도에서 마커 삭제하는 함수
  const removeMapMarker = (marker) => {
    marker.setMap(null); // 지도에서 마커 제거
    setMarkers((prevMarkers) => prevMarkers.filter(m => m.marker !== marker)); // 상태에서 마커 제거
  };

  // 마커 리스트에서 특정 마커 삭제하는 함수
  const handleDeleteMarker = (id) => {
    const markerToDelete = markers.find(m => m.id === id);
    if (markerToDelete) {
      removeMapMarker(markerToDelete.marker); // 지도에서 마커 제거
    }
  };

  useEffect(() => {
    loadKakaoMap();
  }, []);

  return (
    <div>
        <div
            ref={mapRef}
            className="map-container" // CSS 클래스 추가
        />
        {/* 마커 리스트 표시 */}
        <div className="marker-container">
            <div className="marker-list-container"> {/* 리스트를 감싸는 컨테이너 추가 */}
            <div className="marker-list">
                <h3>마커 리스트 1</h3>
                <ul>
                {markers.length === 0 ? (
                    <li>현재 마커가 없습니다.</li> // 마커가 없을 때 메시지 표시
                ) : (
                    markers.map(marker => (
                    <li key={marker.id}>
                        위도 {marker.lat}, 경도 {marker.lng}
                        <button onClick={() => handleDeleteMarker(marker.id)}>X</button> {/* 삭제 버튼 추가 */}
                    </li>
                    ))
                )}
                </ul>
            </div>
            <div className="marker-list">
                <h3>마커 리스트 2</h3>
                <ul>
                {markers.length === 0 ? (
                    <li>현재 마커가 없습니다.</li> // 마커가 없을 때 메시지 표시
                ) : (
                    markers.map(marker => (
                    <li key={marker.id}>
                        위도 {marker.lat}, 경도 {marker.lng}
                        <button onClick={() => handleDeleteMarker(marker.id)}>X</button> {/* 삭제 버튼 추가 */}
                    </li>
                    ))
                )}
                </ul>
            </div>
        </div>
        </div>
        </div>

  );
  
};

export default MainMapComponent;
