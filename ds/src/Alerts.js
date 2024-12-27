// Alerts.js

import React, { useState } from 'react';
import './Styles/App.css';
import MenuBar from './MenuBar';

const Alerts = () => {
  // 샘플 경고 및 알림 데이터
  const [alerts, setAlerts] = useState([
    { id: 1, message: '발전소 A에서 출력 전압 이상 발생', type: 'error', timestamp: '2024-10-22 14:00' },
    { id: 2, message: '배터리 B의 잔량이 20% 미만입니다', type: 'warning', timestamp: '2024-10-23 09:00' },
    { id: 3, message: '에너지 거래 매칭 완료', type: 'info', timestamp: '2024-10-23 10:30' },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />

        <h1 className="page-title">경고 및 알림 시스템</h1>
        <p className="page-subtitle">실시간 장비 경고 및 알림을 확인하세요.</p>

        {/* 경고 및 알림 목록 */}
        <div className="alerts-container">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item alert-${alert.type}`}
            >
              <strong>{alert.timestamp}</strong>
              <p>{alert.message}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default Alerts;
