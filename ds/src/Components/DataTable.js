import React, { useState } from "react";
import "../Styles/Clebine.css";
import graph from '../Styles/image/graph.png';
import graph2 from '../Styles/image/graph2.png';

const DataTable = ({ tableData, onDelete }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedTint, setSelectedTint] = useState(null);

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

  const handleDetailClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
    setSelectedTint(null);
  };

  const handleTintChange = (tint) => {
    setSelectedTint(tint);
  };

  const getImageStyle = () => {
    switch (selectedTint) {
      case "red":
        return { filter: "sepia(100%) saturate(200%) hue-rotate(0deg)" };
      case "orange":
        return { filter: "sepia(100%) saturate(200%) hue-rotate(30deg)" };
      case "yellow":
        return { filter: "sepia(100%) saturate(200%) hue-rotate(60deg)" };
      default:
        return {};
    }
  };
  
  return (
    <>
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
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  파일을 올려주세요
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => {
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
                    <td>
                      <button 
                        className="detail-button"
                        onClick={() => handleDetailClick(row.id)}
                        style={{
                          padding: "5px 10px",
                          border: "1px ridge black",
                          borderRadius: "4px",
                          backgroundColor: expandedRow === row.id ? "#e0e0e0" : "white",
                          cursor: "pointer"
                        }}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {expandedRow && (
        <div className="detail-section" style={{
          marginTop: "30px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px"
        }}>
          <div style={{ display: "flex", gap: "30px" }}>
            <button 
              onClick={() => handleTintChange("red")}
              style={{
                padding: "5px 15px",
                cursor: "pointer",
                backgroundColor: selectedTint === "red" ? "#e0e0e0" : "white",
                border: "1px ridge black",
                borderRadius: "4px"
              }}
            >
              일봉
            </button>
            <button 
              onClick={() => handleTintChange("orange")}
              style={{
                padding: "5px 15px",
                cursor: "pointer",
                backgroundColor: selectedTint === "orange" ? "#e0e0e0" : "white",
                border: "1px ridge black",
                borderRadius: "4px"
              }}
            >
              주봉
            </button>
            <button 
              onClick={() => handleTintChange("yellow")}
              style={{
                padding: "5px 15px",
                cursor: "pointer",
                backgroundColor: selectedTint === "yellow" ? "#e0e0e0" : "white",
                border: "1px ridge black",
                borderRadius: "4px"
              }}
            >
              월봉
            </button>
          </div>
          <img
            src={tableData.findIndex(row => row.id === expandedRow) % 2 === 0 ? graph : graph2}
            alt="graph"
            width="400px"
            style={getImageStyle()}
          />
        </div>
      )}
    </>
  );
};

export default DataTable;