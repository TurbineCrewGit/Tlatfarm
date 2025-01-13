import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Components/Header';
import ThemeToggle from './Components/ThemeToggle';
import './Styles/ClebineDetail.css';

const ClebineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [detailData, setDetailData] = useState(null);
  const [error, setError] = useState(null);
  const [energyPrediction, setEnergyPrediction] = useState(null);

  // 에너지 예측값 로딩
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const inputData = [20.5, 300, 5.5, 0.2]; // 예시 입력값 배열, 전 페이지에서 받아오기
        // 순서대로 온도, 습도, 풍향, 강수량 (임시 데이터)
        const response = await axios.post('http://localhost:8080/predict/energy', inputData, {
          headers: { 'Content-Type': 'application/json' },
        });
        setEnergyPrediction(response.data);
      } catch (err) {
        console.error('API 호출 중 오류 발생:', err);
        setError(err.message);
      }
    };

    fetchPrediction();
  }, []);

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

            <div className='predictContainer'>
              <h3>{id} 에너지 예측 결과</h3>
              {energyPrediction ? (
                <div style={{ marginTop: '10px' }}>
                  <p>태양광 발전량: {energyPrediction[0]}</p>
                  <p>풍력 발전량: {energyPrediction[1]}</p>
                </div>
              ) : (
                <p>예측 데이터를 로드 중...</p>
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
