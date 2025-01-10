// src/Components/WeatherIcon.js
import React from "react";
import {
  getWindDirectionImage,
  getHumidityImage,
  getRainfallImage,
  getTemperatureImage
} from '../utils/weatherUtils';

const WeatherIcon = ({ type, value, additionalInfo }) => {
  if (value === undefined || value === null || value === '') return '-';

  let src = '';
  let altText = '';
  let tooltip = '';

  switch (type) {
    case 'wind':
      src = `${process.env.PUBLIC_URL}/windInfo/${getWindDirectionImage(parseFloat(value))}.png`;
      altText = `풍향 ${value}°`;
      tooltip = additionalInfo || `풍향: ${value}°`;
      break;
    case 'humidity':
      src = `${process.env.PUBLIC_URL}/humidity/${getHumidityImage(parseFloat(value))}.png`;
      altText = `습도 ${value}%`;
      tooltip = `습도: ${value}%`;
      break;
    case 'rainfall':
      src = `${process.env.PUBLIC_URL}/rainfall/${getRainfallImage(parseFloat(value))}.png`;
      altText = `강수량 ${value}mm`;
      tooltip = `강수량: ${value}mm`;
      break;
    case 'temperature':
      src = `${process.env.PUBLIC_URL}/temp/${getTemperatureImage(parseFloat(value))}.png`;
      altText = `온도 ${value}°C`;
      tooltip = `온도: ${value}°C`;
      break;
    default:
      return '-';
  }

  return (
    <div className="weather-tooltip">
      <img
        className="tableImg"
        src={src}
        alt={altText}
      />
      <div className="tooltip-text">
        {tooltip}
      </div>
    </div>
  );
};

export default WeatherIcon;
