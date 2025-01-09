// ClebineDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Components/Header';
import './Styles/ClebineDetail.css'

const ClebineDetail = ({ tableData }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // tableData에서 해당 id의 데이터를 찾습니다.
  const detailData = tableData.find(row => row.id === id);

  if (!detailData) {
    return (
      <div>
        <h2>해당 ID의 데이터를 찾을 수 없습니다: {id}</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
          뒤로가기
        </button>
      </div>
    );
  }

  return (
    <>
        <div>
        <Header />
        </div>
        <div className='detail_body' style={{marginTop:'130px'}}>
            <h2>ID: {id} 상세 페이지</h2>
            <button className='backBtn' onClick={() => navigate(-1)}>
                뒤로가기
            </button>
        </div>
    </>
    
  );
};

export default ClebineDetail;