import React from "react";
import "../Styles/Clebine.css";

const DataTable = ({ tableData, onDelete }) => {
  return (
    <div>
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
          {/* 파일 데이터가 없을 경우 '파일을 올려주세요'라는 메시지 추가 */}
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                파일을 올려주세요
              </td>
            </tr>
          ) : (
            tableData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.powerProduction}</td>
                <td>{row.latitude}</td>
                <td>{row.longitude}</td>
                <td>
                  <button id="deleteBtn" onClick={() => onDelete(row.id)}>X</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
