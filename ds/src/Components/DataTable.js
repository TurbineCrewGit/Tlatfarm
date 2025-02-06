// src/Components/DataTable.js
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../Styles/DataTable.css";
import TableRow from './TableRow';

const DataTable = ({ tableData, onDelete }) => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false); // 다크 모드 상태 감지

  // 다크 모드 상태 감지
  useEffect(() => {
      const handleDarkModeChange = () => {
          setIsDarkMode(document.body.classList.contains('dark-mode'));
      };

      handleDarkModeChange(); // 초기 다크 모드 상태 확인
      const observer = new MutationObserver(handleDarkModeChange);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

      return () => observer.disconnect();
  }, []);

  // 날씨 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchWeatherData = async () => {
      const newWeatherData = {};

      for (const row of tableData) {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/${row.id}.csv`);
          const csvText = await response.text();

          const lines = csvText.split('\n');
          if (lines.length > 1) {
            const latestData = lines[1].split(',');
            newWeatherData[row.id] = {
              temperature: latestData[2],
              humidity: latestData[3],
              windDirect: parseFloat(latestData[5]),
              windSpeed: `${latestData[4]}m/s`,
              rainfall: latestData[8],
            };
          }
        } catch (error) {
          console.error(`ID ${row.id}의 CSV 로딩 오류:`, error);
        }
      }
      setWeatherData(newWeatherData);
    };

    if (tableData.length > 0) {
      fetchWeatherData();
    }
  }, [tableData]);

  console.log('isDarkMode changed: ', isDarkMode);
  return (
    <div className="clebine-container">
      <h1 className="clebine-title">Clebine list</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>전력 생산량</th>
            <th>위도</th>
            <th>경도</th>
            <th>Weather Info</th>
            <th>Detail</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            tableData.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                weatherData={weatherData[row.id]}
                onDelete={onDelete}
                navigate={navigate}
                mode={isDarkMode ? 'dark' : 'light'}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
