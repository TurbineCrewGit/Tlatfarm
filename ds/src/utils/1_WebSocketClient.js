export const createWebSocketConnection = (onMessage, onDataChanged) => {
    const socket = new WebSocket("ws://localhost:8080/ws/data");

    socket.onopen = () => console.log("WebSocket 연결 성공");
    socket.onclose = () => console.log("WebSocket 연결 종료");
    socket.onerror = (error) => console.error("WebSocket 에러:", error);

    socket.onmessage = (event) => {
        console.log("수신 데이터:", event.data);
        const parsedData = JSON.parse(event.data);

        // 데이터 변경 이벤트 처리
        if (parsedData.type === "update") {
            onDataChanged(true); // 변경 플래그 설정
        }

        onMessage(parsedData); // 기존 메시지 처리
    };

    return socket;
};
