// useMarkers.js

import { useState, useRef, useCallback } from 'react';
import { FLIGHT_MODES } from './constants';
import { v4 as uuidv4 } from 'uuid';

function useMarkers(mapRef) {
  const [coordinates, setCoordinates] = useState([]);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const distanceLabelsRef = useRef([]);

  // **마커 이미지 업데이트 함수**
  const updateMarkerImages = useCallback(() => {
    const firstMarkerImageSrc = `${process.env.PUBLIC_URL}/smartpolemarker_start.png`;
    const normalMarkerImageSrc = `${process.env.PUBLIC_URL}/smartpolemarker.png`;
    const imageSize = new window.kakao.maps.Size(70, 80);

    markersRef.current.forEach((marker, index) => {
      const markerImage = new window.kakao.maps.MarkerImage(
        index === 0 ? firstMarkerImageSrc : normalMarkerImageSrc,
        imageSize
      );
      marker.setImage(markerImage);
    });
  }, []);

  // **비행 방식 업데이트 함수**
  const updateFlightModes = useCallback(() => {
    setCoordinates((prevCoords) => {
      if (prevCoords.length === 0) return prevCoords;

      const updatedCoords = prevCoords.map((coord, index) => {
        if (index === 0) {
          return { ...coord, flightMode: FLIGHT_MODES.TAKEOFF };
        } else if (index === prevCoords.length - 1) {
          return { ...coord, flightMode: FLIGHT_MODES.LANDING };
        } else if (
          coord.flightMode === FLIGHT_MODES.TAKEOFF ||
          coord.flightMode === FLIGHT_MODES.LANDING
        ) {
          return { ...coord, flightMode: FLIGHT_MODES.MOVE };
        } else {
          return coord;
        }
      });

      return updatedCoords;
    });
  }, []);

  // **마커 삭제 함수** (순서를 위로 이동)
  const removeMarker = useCallback(
    (index) => {
      const markerToRemove = markersRef.current[index];
      if (markerToRemove) {
        markerToRemove.setMap(null);
        markersRef.current.splice(index, 1);
      }

      setCoordinates((prevCoords) => prevCoords.filter((_, i) => i !== index));
      updateMarkerImages(); // 마커 이미지 업데이트
      updateFlightModes();  // 비행 방식 업데이트
    },
    [setCoordinates, updateMarkerImages, updateFlightModes]
  );

  // **마커 추가 함수** (removeMarker 이후에 정의)
  const addMarker = useCallback(
    (latlng, alt = 0) => {
      const firstMarkerImageSrc = `${process.env.PUBLIC_URL}/smartpolemarker_start.png`;
      const normalMarkerImageSrc = `${process.env.PUBLIC_URL}/smartpolemarker.png`;
      const imageSize = new window.kakao.maps.Size(70, 80);

      const markerImage = new window.kakao.maps.MarkerImage(
        markersRef.current.length === 0 ? firstMarkerImageSrc : normalMarkerImageSrc,
        imageSize
      );

      const newMarker = new window.kakao.maps.Marker({
        position: latlng,
        map: mapRef.current,
        image: markerImage,
        draggable: true,
      });

      markersRef.current.push(newMarker);

      const newCoordinate = {
        id: uuidv4(),
        lat: parseFloat(latlng.getLat().toFixed(6)),
        lng: parseFloat(latlng.getLng().toFixed(6)),
        alt: parseFloat(alt),
        flightMode: FLIGHT_MODES.MOVE,
      };

      setCoordinates((prevCoords) => {
        const updatedCoords = [...prevCoords, newCoordinate];

        if (updatedCoords.length === 1) {
          updatedCoords[0].flightMode = FLIGHT_MODES.TAKEOFF;
        } else if (updatedCoords.length === 2) {
          updatedCoords[1].flightMode = FLIGHT_MODES.LANDING;
        } else {
          updatedCoords[updatedCoords.length - 2].flightMode = FLIGHT_MODES.MOVE;
          updatedCoords[updatedCoords.length - 1].flightMode = FLIGHT_MODES.LANDING;
        }

        return updatedCoords;
      });

      // 마커 클릭 이벤트: 마커 삭제
      window.kakao.maps.event.addListener(newMarker, 'click', function () {
        const index = markersRef.current.indexOf(newMarker);
        if (index > -1) {
          removeMarker(index);
        }
      });

      // 마커 드래그 종료 이벤트: 좌표 업데이트
      window.kakao.maps.event.addListener(newMarker, 'dragend', function () {
        const newPosition = newMarker.getPosition();
        const index = markersRef.current.indexOf(newMarker);
        if (index > -1) {
          setCoordinates((prevCoords) => {
            const updatedCoords = [...prevCoords];
            updatedCoords[index] = {
              ...updatedCoords[index],
              lat: parseFloat(newPosition.getLat().toFixed(6)),
              lng: parseFloat(newPosition.getLng().toFixed(6)),
            };
            return updatedCoords;
          });
        }
      });
    },
    [mapRef, setCoordinates, removeMarker]
  );

  // **마커 순서 변경 함수**
  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      setCoordinates((prevCoords) => {
        const newCoords = [...prevCoords];
        const [removed] = newCoords.splice(dragIndex, 1);
        newCoords.splice(hoverIndex, 0, removed);
        return newCoords;
      });

      const newMarkers = [...markersRef.current];
      const [removedMarker] = newMarkers.splice(dragIndex, 1);
      newMarkers.splice(hoverIndex, 0, removedMarker);
      markersRef.current = newMarkers;

      updateMarkerImages(); // 마커 이미지 업데이트
      updateFlightModes();  // 비행 방식 업데이트
    },
    [setCoordinates, updateMarkerImages, updateFlightModes]
  );

  // **마커 위로 이동**
  const moveMarkerUp = useCallback(
    (index) => {
      if (index === 0) return;
      moveItem(index, index - 1);
    },
    [moveItem]
  );

  // **마커 아래로 이동**
  const moveMarkerDown = useCallback(
    (index) => {
      if (index === coordinates.length - 1) return;
      moveItem(index, index + 1);
    },
    [moveItem, coordinates.length]
  );

  // **지도 초기화 함수**
  const resetMap = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.length = 0;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    distanceLabelsRef.current.forEach((label) => label.setMap(null));
    distanceLabelsRef.current = [];

    setCoordinates([]);
  }, [setCoordinates]);

  return {
    coordinates,
    setCoordinates,
    markersRef,
    addMarker,
    removeMarker,
    updateFlightModes,
    moveItem,
    moveMarkerUp,
    moveMarkerDown,
    resetMap,
    polylineRef,
    distanceLabelsRef,
    updateMarkerImages,
  };
}

export default useMarkers;
