export const getPowerBackgroundColor = (powerValue, mode = 'light') => { // mode의 기본값을 'light'로 설정
    console.log("powerValue:", powerValue, "mode:", mode);
    const value = parseFloat(powerValue);
    
    const colors = {
      dark: {
        zero: "rgb(20, 20, 20)", 
        low: "rgb(148, 20, 20)",  
        medium: "rgb(148, 93, 20)", 
        high: "rgb(148, 148, 20)", 
        veryHigh: "rgb(70, 148, 70)", 
      },
      light: {
        zero: "rgb(151, 151, 151)", 
        low: "rgb(242, 139, 130)",  
        medium: "rgb(251, 188, 4)", 
        high: "rgb(255, 244, 117)", 
        veryHigh: "rgb(204, 255, 144)", 
      },
    };
  
    // mode가 undefined일 경우 'light' 모드를 사용
    const currentColors = colors[mode] || colors['light'];
  
    if (value === 0) return currentColors.zero;
    if (value >= 1 && value <= 49) return currentColors.low;
    if (value >= 50 && value <= 99) return currentColors.medium;
    if (value >= 100 && value <= 149) return currentColors.high;
    if (value >= 150) return currentColors.veryHigh;
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
  