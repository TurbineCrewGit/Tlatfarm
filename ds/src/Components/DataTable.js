import React from "react";
import "../Styles/Clebine.css";

const DataTable = ({ tableData, onDelete }) => {
  // 전력 생산량에 따른 배경색 반환 함수
  const getPowerBackgroundColor = (powerValue) => {
    if (powerValue === 0) {
      return "rgba(0, 0, 0, 0.5)"; // Black for 0W
    } else if (powerValue >= 1 && powerValue <= 49) {
      return "rgba(255, 0, 0, 0.5)"; // Light Red
    } else if (powerValue >= 50 && powerValue <= 99) {
      return "rgba(255, 145, 0, 0.5)"; // Light Orange
    } else if (powerValue >= 100 && powerValue <= 149) {
      return "rgba(255, 255, 0, 0.5)"; // Light Yellow
    } else if (powerValue >= 150) {
      return "rgba(100, 255, 100, 0.5)"; // Light Green
    }
    return ""; // 기본값 (배경색 없음)
  };

  return (
    <div className="clebine-container">
      <h1 className="clebine-title">Clebine</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>전력 생산량</th>
            <th>위도</th>
            <th>경도</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                파일을 올려주세요
              </td>
            </tr>
          ) : (
            tableData.map((row) => {
              const powerValue = parseFloat(row.powerProduction);
              const powerBackgroundColor = getPowerBackgroundColor(powerValue);

              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td
                    style={{
                      backgroundColor: powerBackgroundColor,
                    }}
                  >
                    {row.powerProduction}
                  </td>
                  <td>{row.latitude}</td>
                  <td>{row.longitude}</td>
                  <td>
                    <button
                      id="deleteBtn"
                      onClick={() => onDelete(row.id)}
                      style={{ padding: "5px 10px", cursor: "pointer" }}
                    >
                      X
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
