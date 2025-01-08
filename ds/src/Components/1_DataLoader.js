import Papa from "papaparse"; // CSV 파싱 라이브러리

/**
 * CSV 데이터를 로드하는 함수
 * @param {string} csvUrl - CSV 파일의 경로
 * @returns {Promise<Array>} - CSV 데이터 배열 반환
 */
export const loadCsvData = async (csvUrl) => {
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error(`CSV 파일 로드 실패: ${csvUrl}`);

        const csvText = await response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log("CSV 데이터 로드 완료:", results.data);
                    resolve(results.data);
                },
                error: (error) => {
                    console.error("CSV 파싱 오류:", error);
                    reject(error);
                },
            });
        });
    } catch (error) {
        console.error("CSV 데이터 로드 오류:", error);
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

