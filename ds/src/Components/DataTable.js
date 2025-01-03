import React from "react";
import { useNavigate } from 'react-router-dom';
import "../Styles/DataTable.css";

const DataTable = ({ tableData, onDelete }) => {
  const navigate = useNavigate();

  const getPowerBackgroundColor = (powerValue) => {
    if (powerValue === 0) {
      return "rgba(0, 0, 0, 0.5)"; // 0W은 검정색
    } else if (powerValue >= 1 && powerValue <= 49) {
      return "rgba(255, 0, 0, 0.5)"; // 연한 빨강
    } else if (powerValue >= 50 && powerValue <= 99) {
      return "rgba(255, 145, 0, 0.5)"; // 연한 주황
    } else if (powerValue >= 100 && powerValue <= 149) {
      return "rgba(255, 255, 0, 0.5)"; // 연한 노랑
    } else if (powerValue >= 150) {
      return "rgba(100, 255, 100, 0.5)"; // 연한 초록
    }
    return ""; // 기본값 (배경색 없음)
  };

  const handleDetailClick = (id) => {
    navigate(`/clebinepage/${id}`);
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
            <th>풍향/풍속</th>
            <th>습도</th>
            <th>강수량</th>
            <th>일조량</th>
            <th>기온</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
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
                  <td style={{ backgroundColor: powerBackgroundColor }}>
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
                  <td>{row.windInfo}</td>
                  <td>{row.humidity}</td>
                  <td>{row.rainfall}</td>
                  <td>{row.sunlight}</td>
                  <td>{row.temperature}</td>
                  <td>
                    <button
                      className="detailBtn"
                      onClick={() => handleDetailClick(row.id)}
                    >
                      detail
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