// src/utils/weatherUtils.js

export const getPowerBackgroundColor = (powerValue) => {
    const value = parseFloat(powerValue);
    if (value === 0) return "#141414";
    if (value >= 1 && value <= 49) return "#941414";
    if (value >= 50 && value <= 99) return "#945D14";
    if (value >= 100 && value <= 149) return "#949414";
    if (value >= 150) return "#469446";
    return "";
  };
  
  export const getWindDirectionImage = (windDirect) => {
    if (windDirect >= 22.5 && windDirect < 67.5) return "225_675";
    if (windDirect >= 67.5 && windDirect < 112.5) return "675_1125";
    if (windDirect >= 112.5 && windDirect < 157.5) return "1125_1575";
    if (windDirect >= 157.5 && windDirect < 202.5) return "1575_2025";
    if (windDirect >= 202.5 && windDirect < 247.5) return "2025_2475";
    if (windDirect >= 247.5 && windDirect < 292.5) return "2475_2925";
    if (windDirect >= 292.5 && windDirect < 337.5) return "2925_3375";
    return "0_225"; // 기본값 또는 북풍
  };
  
  export const getHumidityImage = (humidity) => {
    const h = parseFloat(humidity);
    if (h <= 30) return "under30";
    if (h <= 50) return "between31_50";
    if (h <= 70) return "between51_70";
    return "over70";
  };
  
  export const getRainfallImage = (rainfall) => {
    const r = parseFloat(rainfall);
    if (r <= 0) return "sunny";
    if (r <= 0.1) return "between0_01";
    if (r <= 0.5) return "between01_05";
    return "up5";
  };
  
  export const getTemperatureImage = (temperature) => {
    const t = parseFloat(temperature);
    if (t <= 0) return "under0c";
    if (t <= 15) return "between0_15";
    if (t <= 30) return "between15_30";
    return "over30c";
  };
  