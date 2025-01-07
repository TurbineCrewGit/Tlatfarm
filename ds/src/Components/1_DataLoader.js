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
 * @param {Array<string>} fileUrls - JSON 파일의 경로 배열
 * @returns {Promise<Array>} - 모든 드론 데이터 배열 반환
 */
export const loadDroneData = async (fileUrls) => {
    try {
        const allData = await Promise.all(
            fileUrls.map(async (url) => {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`파일 로드 실패: ${url}`);
                return await response.json();
            })
        );
        console.log("드론 데이터 로드 완료:", allData);
        return allData;
    } catch (error) {
        console.error("드론 데이터 로드 오류:", error);
        throw error;
    }
};
