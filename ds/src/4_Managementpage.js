import React, { useState } from "react";
import axios from "axios";
import Header from "./Components/Header.js";

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
    <div style={{ padding: "20px" }}>
      <Header />

      <main className="main">
        <div style={{ marginBottom: "20px" }}>
          <label>
            Temperature (°C):
            <input
              type="number"
              name="temperature"
              value={weatherData.temperature}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Sunlight (hours):
            <input
              type="number"
              name="sunlight"
              value={weatherData.sunlight}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Wind Speed (m/s):
            <input
              type="number"
              name="windSpeed"
              value={weatherData.windSpeed}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Rainfall (mm):
            <input
              type="number"
              name="rainfall"
              value={weatherData.rainfall}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div>
          <button onClick={handleEnergyPrediction}>Predict Energy</button>
          <button onClick={handleNdviPrediction}>Predict NDVI</button>
        </div>

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
      </main>
    </div>
  );
};

export default PredictionDashboard;
