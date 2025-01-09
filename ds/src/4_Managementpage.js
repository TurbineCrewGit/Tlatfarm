import React, { useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "./Components/Header.js";
import ThemeToggle from "./Components/ThemeToggle.js";

const theme = createTheme();

const PredictionDashboard = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: "",
    sunlight: "",
    windSpeed: "",
    rainfall: "",
  });

  const [energyPrediction, setEnergyPrediction] = useState(null);
  const [ndviPrediction, setNdviPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWeatherData({ ...weatherData, [name]: value });
  };

  const handleEnergyPrediction = async () => {
    try {
      setError(null);
      const response = await axios.post("/predict/energy", [
        parseFloat(weatherData.temperature),
        parseFloat(weatherData.sunlight),
        parseFloat(weatherData.windSpeed),
        parseFloat(weatherData.rainfall),
      ]);
      setEnergyPrediction(response.data);
    } catch (err) {
      setError("Failed to fetch energy prediction.");
    }
  };

  const handleNdviPrediction = async () => {
    try {
      setError(null);
      const response = await axios.post("/predict/agriculture", [
        parseFloat(weatherData.temperature),
        parseFloat(weatherData.sunlight),
        parseFloat(weatherData.windSpeed),
        parseFloat(weatherData.rainfall),
      ]);
      setNdviPrediction(response.data);
    } catch (err) {
      setError("Failed to fetch NDVI prediction.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="planner">
        
        <Header />

        <hr className="custom_hr" />

        <main className="main">
          
          <table>
            <tr>
              <th colSpan={2}>Weather Data</th>
            </tr>
            <tr>
              <td>Temperature (°C):</td>
              <td>
                <input
                  type="number"
                  name="temperature"
                  value={weatherData.temperature}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            <tr>
              <td>Sunlight (hours):</td>
              <td>
                <input
                  type="number"
                  name="sunlight"
                  value={weatherData.sunlight}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Wind Speed (m/s):</td>
              <td>
                <input
                  type="number"
                  name="windSpeed"
                  value={weatherData.windSpeed}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Rainfall (mm):</td>
              <td>
                <input
                  type="number"
                  name="rainfall"
                  value={weatherData.rainfall}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button className="btn" onClick={handleEnergyPrediction}>
                  Predict Energy
                </button>
                <button className="btn" onClick={handleNdviPrediction}>
                  Predict NDVI
                </button>
              </td>
            </tr>
          </table>

          {energyPrediction && (
            <div>
              <h3>Energy Prediction</h3>
              <p>Solar Power: {energyPrediction[0].toFixed(2)}</p>
              <p>Wind Power: {energyPrediction[1].toFixed(2)}</p>
            </div>
          )}

          {ndviPrediction && (
            <div>
              <h3>NDVI Prediction</h3>
              <p>NDVI: {ndviPrediction.toFixed(2)}</p>
            </div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}

          <ThemeToggle />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default PredictionDashboard;
