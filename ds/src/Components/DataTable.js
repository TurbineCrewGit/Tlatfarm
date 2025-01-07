import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../Styles/DataTable.css";

const DataTable = ({ tableData, onDelete }) => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState({});

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

  const getPowerBackgroundColor = (powerValue) => {
    const value = parseFloat(powerValue);
    if (value === 0) return "#141414";
    if (value >= 1 && value <= 49) return "#941414";
    if (value >= 50 && value <= 99) return "#945D14";
    if (value >= 100 && value <= 149) return "#949414";
    if (value >= 150) return "#469446";
    return "";
  };

  const handleDetailClick = (id) => {
    navigate(`/clebinepage/${id}`);
  };

  const renderWeatherIcon = (data) => {
    if (!data) return '-';

    const { windDirect, humidity, rainfall, temperature, windSpeed } = data;

    return (
      <div className="weather-column">
        {/* 풍향 */}
        {windDirect !== undefined ? (
          <div className="weather-tooltip">
            <img
              className="tableImg"
              src={`${process.env.PUBLIC_URL}/windInfo/${getWindDirectionImage(windDirect)}.png`}
              alt={`풍향 ${windDirect}`}
            />
            <div className="tooltip-text">
              풍향: {windDirect}°
              <br />
              풍속: {windSpeed}
            </div>
          </div>
        ) : (
          '-'
        )}

        {/* 습도 */}
        {humidity !== undefined ? (
          <div className="weather-tooltip">
            <img
              className="tableImg"
              src={`${process.env.PUBLIC_URL}/humidity/${getHumidityImage(humidity)}.png`}
              alt={`습도 ${humidity}`}
            />
            <div className="tooltip-text">
              습도: {humidity}%
            </div>
          </div>
        ) : (
          '-'
        )}

        {/* 강수량 */}
        {rainfall !== undefined ? (
          <div className="weather-tooltip">
            <img
              className="tableImg"
              src={`${process.env.PUBLIC_URL}/rainfall/${getRainfallImage(rainfall)}.png`}
              alt={`강수량 ${rainfall}`}
            />
            <div className="tooltip-text">
              강수량: {rainfall}mm
            </div>
          </div>
        ) : (
          '-'
        )}

        {/* 온도 */}
        {temperature !== undefined ? (
          <div className="weather-tooltip">
            <img
              className="tableImg"
              src={`${process.env.PUBLIC_URL}/temp/${getTemperatureImage(temperature)}.png`}
              alt={`온도 ${temperature}`}
            />
            <div className="tooltip-text">
              온도: {temperature}°C
            </div>
          </div>
        ) : (
          '-'
        )}
      </div>
    );
  };

  const getWindDirectionImage = (windDirect) => {
    if (windDirect >= 22.5 && windDirect < 67.5) return "225_675";
    if (windDirect >= 67.5 && windDirect < 112.5) return "675_1125";
    if (windDirect >= 112.5 && windDirect < 157.5) return "1125_1575";
    if (windDirect >= 157.5 && windDirect < 202.5) return "1575_2025";
    if (windDirect >= 202.5 && windDirect < 247.5) return "2025_2475";
    if (windDirect >= 247.5 && windDirect < 292.5) return "2475_2925";
    if (windDirect >= 292.5 && windDirect < 337.5) return "2925_3375";
    return "0_225"; // 기본값 또는 북풍
  };

  const getHumidityImage = (humidity) => {
    const h = parseFloat(humidity);
    if (h <= 30) return "under30";
    if (h <= 50) return "between31_50";
    if (h <= 70) return "between51_70";
    return "over70";
  };

  const getRainfallImage = (rainfall) => {
    const r = parseFloat(rainfall);
    if (r <= 0) return "sunny";
    if (r <= 0.1) return "between0_01";
    if (r <= 0.5) return "between01_05";
    return "up5";
  };

  const getTemperatureImage = (temperature) => {
    const t = parseFloat(temperature);
    if (t <= 0) return "under0c";
    if (t <= 15) return "between0_15";
    if (t <= 30) return "between15_30";
    return "over30c";
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
            <th>Weather Info</th>
            <th>Detail</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
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
                  <td className="weatherColumn">
                    {renderWeatherIcon(rowWeatherData)}
                  </td>
                  <td>
                    <button
                      className="detailBtn"
                      onClick={() => handleDetailClick(row.id)}
                    >
                      Detail
                    </button>
                  </td>
                  <td>
                    <button
                      className="deleteBtn"
                      onClick={() => onDelete(row.id)}
                    >
                      x
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
