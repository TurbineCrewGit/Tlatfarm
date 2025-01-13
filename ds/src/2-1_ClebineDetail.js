// src/ClebineDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Components/Header';
import ThemeToggle from './Components/ThemeToggle';
import './Styles/ClebineDetail.css';
import './utils/weatherUtils.js'

const ClebineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [detailData, setDetailData] = useState(null);
  const [error, setError] = useState(null);
  const [energyPrediction, setEnergyPrediction] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [predictionError, setPredictionError] = useState(null); // 에너지 예측 오류 상태

  // 에너지 예측값 로딩
  useEffect(() => {
    // weatherData가 존재할 때만 예측값을 가져옵니다.
    if (weatherData) {
      const fetchPrediction = async () => {
        try {
          const inputData = [
            parseFloat(weatherData.temperature),
            parseFloat(weatherData.windDirect),
            parseFloat(weatherData.humidity),
            parseFloat(weatherData.rainfall)
          ]; // 입력값 배열: 온도, 풍향, 습도, 강수량
          const response = await axios.post('http://localhost:8080/predict/energy', inputData, {
            headers: { 'Content-Type': 'application/json' },
          });
          setEnergyPrediction(response.data);
          setPredictionError(null); // 성공 시 오류 상태 초기화
        } catch (err) {
          console.error('API 호출 중 오류 발생:', err);
          setPredictionError(err.message);
        }
      };

      fetchPrediction();
    }
  }, [weatherData]); // weatherData가 변경될 때마다 실행

  // 스마트폴 데이터 로딩
  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const response = await axios.get(`/api/smartpoles/${id}`);
        setDetailData(response.data);
      } catch (err) {
        console.error(`ID ${id}의 데이터를 가져오는 중 오류 발생:`, err);
        setError(err);
      }
    };

    fetchDetailData();
  }, [id]);

  // 날씨 데이터 로딩
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/${id}.csv`);
        const csvText = await response.text();

        const lines = csvText.split('\n');
        if (lines.length > 1) {
          const latestData = lines[1].split(',');
          setWeatherData({
            temperature: latestData[2],
            humidity: latestData[3],
            windDirect: parseFloat(latestData[5]),
            windSpeed: `${latestData[4]}m/s`,
            rainfall: latestData[8],
          });
        } else {
          setWeatherData(null); // 데이터가 없을 경우 null 설정
        }
      } catch (error) {
        console.error(`ID ${id}의 CSV 로딩 오류:`, error);
        setWeatherData(null); // 오류 발생 시 null 설정
      }
    };

    fetchWeatherData();
  }, [id]);

  // 전체 에러 상태가 아닌 개별 에러 상태 사용
  if (error) {
    return (
      <div>
        <h2>데이터를 가져오는 중 오류가 발생했습니다: {id}</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
          뒤로가기
        </button>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div>
        <h2>데이터를 로딩 중입니다...</h2>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className='body'>
        <div className='detail_body' style={{ marginTop: '150px' }}>
          <h2 id='detail-title'>ID: {id} 상세 페이지</h2>
          <div className='infoContainer'>
            <div className='detailContainer'>
              <p>전력 생산량: {detailData.powerProduction}</p>
              <p>위도: {detailData.latitude}</p>
              <p>경도: {detailData.longitude}</p>
            </div>

            <div className='weatherInfoContainer'>
              <h3>날씨 정보</h3>
              {weatherData ? (
                <div className="weather-text">
                  <p>온도: {weatherData.temperature}°C</p>
                  <p>습도: {weatherData.humidity}%</p>
                  <p>풍향: {weatherData.windDirect}°</p>
                  <p>풍속: {weatherData.windSpeed}</p>
                  <p>강수량: {weatherData.rainfall}mm</p>
                </div>
              ) : (
                <p>-</p>
              )}
            </div>

            <div className='predictContainer'>
              <h3>{id} 에너지 예측 결과</h3>
              {weatherData ? (
                predictionError ? (
                  <p>-</p>
                ) : energyPrediction ? (
                  <div style={{ marginTop: '10px' }}>
                    <p>태양광 발전량: {energyPrediction[0]}</p>
                    <p>풍력 발전량: {energyPrediction[1]}</p>
                  </div>
                ) : (
                  <p>예측 데이터를 로드 중...</p>
                )
              ) : (
                <p>-</p>
              )}
            </div>
          </div>
          
          <button id='backBtn' onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
            뒤로가기
          </button>
        </div>
      </div>
      <ThemeToggle />
    </>
  );
};

export default ClebineDetail;
