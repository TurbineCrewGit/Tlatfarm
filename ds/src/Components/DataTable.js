import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../Styles/DataTable.css";

const DataTable = ({ tableData, onDelete }) => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const fetchWeatherData = async () => {
      const newWeatherData = {};
      
      // tableData의 각 행에 대해 CSV 파일을 읽어옵니다
      for (const row of tableData) {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/${row.id}.csv`);
          const csvText = await response.text();
          
          // CSV 파싱
          const lines = csvText.split('\n');
          if (lines.length > 1) {  // 헤더와 최소 1개의 데이터 행이 있는지 확인
            const latestData = lines[1].split(',');  // 최신 데이터 사용 (헤더 다음 줄)
            newWeatherData[row.id] = {
              temperature: latestData[2],  // temp
              humidity: latestData[3],     // humidity
              windInfo: `${latestData[5]}° / ${latestData[4]}m/s`,  // wd/ws
              rainfall: latestData[8],     // rainfall
            };
          }
        } catch (error) {
          console.error(`Error loading CSV for ID ${row.id}:`, error);
        }
      }
      setWeatherData(newWeatherData);
    };

    if (tableData.length > 0) {
      fetchWeatherData();
    }
  }, [tableData]);

  const getPowerBackgroundColor = (powerValue) => {
    if (powerValue === 0) {
      return "rgba(0, 0, 0, 0.5)";
    } else if (powerValue >= 1 && powerValue <= 49) {
      return "rgba(255, 0, 0, 0.5)";
    } else if (powerValue >= 50 && powerValue <= 99) {
      return "rgba(255, 145, 0, 0.5)";
    } else if (powerValue >= 100 && powerValue <= 149) {
      return "rgba(255, 255, 0, 0.5)";
    } else if (powerValue >= 150) {
      return "rgba(100, 255, 100, 0.5)";
    }
    return "";
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
              const rowWeatherData = weatherData[row.id] || {};

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
                  <td>{rowWeatherData.windInfo || '-'}</td>
                  <td>{rowWeatherData.humidity || '-'}</td>
                  <td>{rowWeatherData.rainfall || '-'}</td>
                  <td>-</td>
                  <td>{rowWeatherData.temperature || '-'}</td>
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