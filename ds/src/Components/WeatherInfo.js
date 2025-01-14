// src/Components/WeatherInfo.js
import React from "react";
import WeatherIcon from './WeatherIcon';

const WeatherInfo = ({ data }) => {
  if (!data) return '-';

  const { windDirect, humidity, rainfall, temperature, windSpeed } = data;

  console.log("wind speed: ", windSpeed);
  
  return (
    <div className="weather-column">
      {/* 풍향 */}
      <WeatherIcon
        type="wind"
        value1={windDirect}
        value2={windSpeed}
        additionalInfo={`풍향: ${windDirect}°\n풍속: ${windSpeed}`}
      />
      {/* 습도 */}
      <WeatherIcon
        type="humidity"
        value={humidity}
      />
      {/* 강수량 */}
      <WeatherIcon
        type="rainfall"
        value={rainfall}
      />
      {/* 온도 */}
      <WeatherIcon
        type="temperature"
        value={temperature}
      />
    </div>
  );
};

export default WeatherInfo;
