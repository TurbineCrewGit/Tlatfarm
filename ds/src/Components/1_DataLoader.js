/**
 * SmartPole 데이터를 로드하는 함수
 * @returns {Promise<Array>} - SmartPole 데이터 배열 반환
 */
export const loadSmartPoleData = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/smartpoles"); // SmartPole API 경로
        if (!response.ok) throw new Error("SmartPole 데이터 로드 실패");
        const data = await response.json();
        return data; // SmartPole 테이블의 데이터 배열 반환
    } catch (error) {
        console.error("SmartPole 데이터 로드 오류:", error);
        throw error;
    }
};

/**
 * 드론 데이터를 로드하는 함수
 * @returns {Promise<Array>} - 모든 드론 데이터 배열 반환
 */
export const loadDroneData = async () => {
    try {
        // API 경로 설정
        const response = await fetch("http://localhost:8080/api/drones/with-waypoints");
        if (!response.ok) throw new Error("드론 데이터 로드 실패");

        // API 응답 데이터를 JSON 형태로 파싱
        const data = await response.json();

        // 서버에서 이미 정제된 데이터를 반환하므로 추가 변환 없이 그대로 반환
        return data;
    } catch (error) {
        console.error("드론 데이터 로드 오류:", error);
        throw error;
    }
};

