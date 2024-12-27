// dashboard.js

import React, { useState } from 'react';
import './Styles/App.css';
import { FaBatteryHalf, FaSolarPanel } from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import MenuBar from './MenuBar';
import ThemeToggle from "./Components/ThemeToggle.js";

const Dashboard = () => {
  // 샘플 데이터
  const data = [
    { date: '1월 1일', 생산량: 4000, 소비량: 2400 },
    { date: '1월 2일', 생산량: 3000, 소비량: 1398 },
    { date: '1월 3일', 생산량: 2000, 소비량: 9800 },
    { date: '1월 4일', 생산량: 2780, 소비량: 3908 },
    { date: '1월 5일', 생산량: 1890, 소비량: 4800 },
    { date: '1월 6일', 생산량: 2390, 소비량: 3800 },
    { date: '1월 7일', 생산량: 3490, 소비량: 4300 },
  ];

  const [batteryLevel, setBatteryLevel] = useState(50);

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className='title'>
          VPP 통합 대시보드
        </h1>
        <MenuBar />
      </header>

      <main className='main'>
        <div className="dashboard-grid">



          <div className="card-wrapper">
            <div className="dashboard-card">
              <div className="card-title">
                <FaSolarPanel className="card-icon" />
                Solar Power Generation
              </div>
              <div className="card-text">
                현재 발전량: 4,000 kWh
              </div>
              <button className="card-button">자세히 보기</button>
            </div>
          </div>




          <div className="card-wrapper">
            <div className="dashboard-card">
              <div className="card-title">
                <FaBatteryHalf className="card-icon" />
                Battery Status
              </div>
              <div className="card-text">
                현재 배터리 잔량: {batteryLevel}%
              </div>
            </div>
          </div>




          <div className="card-wrapper">
            <div className="dashboard-card">
              <div className="card-title">
                Energy Trading Status
              </div>
              <div className="card-text">
                현재 거래가: 150원/kWh
              </div>
              <button className="card-button">거래 현황 보기</button>
            </div>
          </div>




          <div className="card-wrapper wide-card">
            <div className="dashboard-card chart-card">
              <div className="chart-title">에너지 사용 분석</div>
              <div className="chart-container">

                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="생산량" stroke="var(--tertiary-color)" strokeWidth={2} />
                      <Line type="monotone" dataKey="소비량" stroke="var(--secondary-color)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>
          </div>




          <div className="card-wrapper">
            <div className="dashboard-card">
              <div className="card-title">
                에너지 자원 관리
              </div>
              <div className="slider-label">
                에너지 분배 비율: {batteryLevel}%
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(e.target.value)}
                className="slider"
              />
            </div>
          </div>



        </div>

        <ThemeToggle />
      </main>
    </div>
  );
};

export default Dashboard;
