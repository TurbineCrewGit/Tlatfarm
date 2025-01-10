import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Components/Header';
import axios from 'axios';
import './Styles/ClebineDetail.css';

const ClebineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [error, setError] = useState(null);

  // 디버깅용 콘솔 로그
  console.log("URL에서 가져온 id:", id);

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
        <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
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
      <div className='detail_body' style={{ marginTop: '130px' }}>
        <h2>ID: {id} 상세 페이지</h2>
        <button className='backBtn' onClick={() => navigate(-1)}>
          뒤로가기
        </button>
        <div>
          <p>전력 생산량: {detailData.powerProduction}</p>
          <p>위도: {detailData.latitude}</p>
          <p>경도: {detailData.longitude}</p>
          {/* 필요에 따라 추가 정보 표시 */}
        </div>
      </div>
    </>
  );
};

export default ClebineDetail;
