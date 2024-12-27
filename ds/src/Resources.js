// Resources.js

import React, { useState } from 'react';
import './Styles/App.css'; // 통합된 CSS 파일 임포트
import MenuBar from './MenuBar';

const Resources = () => {
  // 슬라이더 값을 관리하는 상태 변수
  const [distribution, setDistribution] = useState(50); // 초기값은 50%

  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />

        <h1 className="page-title">에너지 자원 관리</h1>
        <p className="page-subtitle">발전소와 배터리의 상태를 실시간으로 모니터링하고 관리합니다.</p>

        {/* 슬라이더 UI 추가 */}
        <div className="slider-container">
          <label className="slider-label">
            에너지 분배 비율: {distribution}%
            <input
              type="range"
              min="0"
              max="100"
              value={distribution}
              onChange={(e) => setDistribution(e.target.value)}
              className="slider"
            />
          </label>
        </div>
      </header>
    </div>
  );
};

export default Resources;
