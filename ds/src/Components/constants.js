export const FLIGHT_MODES = {
  TAKEOFF: 1, // 이륙
  MOVE: 2,    // 이동
  LANDING: 3  // 착륙
};

export const SCROLL_SPEED = 10;  // 스크롤 속도
export const SCROLL_THRESHOLD = 50;  // 마우스가 테이블 상단/하단에서 스크롤을 시작하는 거리

export const KAKAO_MAP_APPKEY = process.env.REACT_APP_KAKAO_MAP_APPKEY; // Kakao 지도 API 키

// export const API_BASE_URL = "https://141b-58-72-215-20.ngrok-free.app";
export const API_BASE_URL = "http://localhost:5000";

export const DEFAULT_MAP_CENTER = { lat: 35.222172, lng: 126.847596 };
export const DEFAULT_MAP_LEVEL = 3;
export const HEADER_HEIGHT = "15vh";
