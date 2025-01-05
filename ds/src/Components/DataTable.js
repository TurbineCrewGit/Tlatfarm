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
              windDirect: `${latestData[5]}°`,
              windSpeed: `${latestData[4]}m/s`,  // wd/ws
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
    if (parseFloat(powerValue) === 0) {
      return "#141414"; // Dark Gray for 0W
    } else if (parseFloat(powerValue) >= 1 && parseFloat(powerValue) <= 49) {
      return "#941414"; // Red for 1W to 49W
    } else if (parseFloat(powerValue) >= 50 && parseFloat(powerValue) <= 99) {
      return "#945D14"; // Light Orange for 50W to 99W
    } else if (parseFloat(powerValue) >= 100 && parseFloat(powerValue) <= 149) {
      return "#949414"; // Yellow for 100W to 149W
    } else if (parseFloat(powerValue) >= 150) {
      return "#469446"; // Green for 150W and above
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
                  
                  {/* "Weather Info" 열 */}
                  <td className="weather-column">
                    <div>
                      {rowWeatherData.windDirect ? (
                        parseFloat(rowWeatherData.windDirect) >= 22.5 && parseFloat(rowWeatherData.windDirect) < 67.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/windInfo/225_675.png`} alt="Wind Direction 22.5-67.5" />
                        ) : parseFloat(rowWeatherData.windDirect) >= 67.5 && parseFloat(rowWeatherData.windDirect) < 112.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/windInfo/675_1125.png`} alt="Wind Direction 67.5-112.5" />
                        ) : parseFloat(rowWeatherData.windDirect) >= 112.5 && parseFloat(rowWeatherData.windDirect) < 157.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/windInfo/1125_1575.png`} alt="Wind Direction 112.5-157.5" />
                        ) : parseFloat(rowWeatherData.windDirect) >= 157.5 && parseFloat(rowWeatherData.windDirect) < 202.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/windInfo/1575_2025.png`} alt="Wind Direction 157.5-202.5" />
                        ) : parseFloat(rowWeatherData.windDirect) >= 202.5 && parseFloat(rowWeatherData.windDirect) < 247.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/windInfo/2025_2475.png`} alt="Wind Direction 202.5-247.5" />
                        ) : parseFloat(rowWeatherData.windDirect) >= 247.5 && parseFloat(rowWeatherData.windDirect) < 292.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/windInfo/2475_2925.png`} alt="Wind Direction 247.5-292.5" />
                        ) : parseFloat(rowWeatherData.windDirect) >= 292.5 && parseFloat(rowWeatherData.windDirect) < 337.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/windInfo/2925_3375.png`} alt="Wind Direction 292.5-337.5" />
                        ) : parseFloat(rowWeatherData.windDirect) >= 337.5 && parseFloat(rowWeatherData.windDirect) < 360 
                        && parseFloat(rowWeatherData.windDirect) >= 0 && parseFloat(rowWeatherData.windDirect) < 22.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/windInfo/0_225.png`} alt="Wind Direction 0-22.5" />
                        ) : (
                          rowWeatherData.windDirect
                        )
                      ) : (
                        '-'
                      )}
                    </div>
                    
                    <div>
                      {rowWeatherData.humidity ? (
                        parseFloat(rowWeatherData.humidity) <= 30 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/humidity/under30.png`} alt="Very dry" />
                        ) : parseFloat(rowWeatherData.humidity) > 31 &&
                          parseFloat(rowWeatherData.humidity) <= 50 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/humidity/between31_50.png`} alt="Dry" />
                        ) : parseFloat(rowWeatherData.humidity) > 51 &&
                          parseFloat(rowWeatherData.humidity) <= 70 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/humidity/between51_70.png`} alt="Good" />
                        ) : parseFloat(rowWeatherData.humidity) > 70 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/humidity/over70.png`} alt="Wet" />
                        ) : (
                          rowWeatherData.humidity
                        )
                      ) : (
                        '-'
                      )}
                    </div>

                    <div>
                      {rowWeatherData.rainfall ? (
                        parseFloat(rowWeatherData.rainfall) <= 0 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/rainfall/sunny.png`} alt="Sunny" />
                        ) : parseFloat(rowWeatherData.rainfall) > 0 &&
                          parseFloat(rowWeatherData.rainfall) <= 0.1 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/rainfall/between0_01.png`} alt="Little rain" />
                        ) : parseFloat(rowWeatherData.rainfall) > 0.1 &&
                          parseFloat(rowWeatherData.rainfall) <= 0.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/rainfall/between01_05.png`} alt="Rain" />
                        ) : parseFloat(rowWeatherData.rainfall) > 0.5 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/rainfall/up5.png`} alt="Storm rain" />
                        ) : (
                          rowWeatherData.rainfall
                        )
                      ) : (
                        '-'
                      )}
                    </div>

                    <div>
                      {rowWeatherData.temperature ? (
                        parseFloat(rowWeatherData.temperature) <= 0 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/temp/under0c.png`} alt="Cold" />
                        ) : parseFloat(rowWeatherData.temperature) > 0 &&
                          parseFloat(rowWeatherData.temperature) <= 15 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/temp/between0_15.png`} alt="Warm" />
                        ) : parseFloat(rowWeatherData.temperature) > 15 &&
                          parseFloat(rowWeatherData.temperature) <= 30 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/temp/between15_30.png`} alt="Hot" />
                        ) : parseFloat(rowWeatherData.temperature) > 30 ? (
                          <img className="tableImg" src={`${process.env.PUBLIC_URL}/temp/over30c.png`} alt="Very Hot" />
                        ) : (
                          rowWeatherData.temperature
                        )
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>

                  <td>
                    <button
                      className="detailBtn"
                      onClick={() => handleDetailClick(row.id)}
                    >
                      detail
                    </button>
                  </td>
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
