// Analysis.js

import React from 'react';
import './Styles/App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MenuBar from './MenuBar';

// 샘플 에너지 사용 데이터
const data = [
  { date: '1월 1일', 생산량: 4000, 소비량: 2400 },
  { date: '1월 2일', 생산량: 3000, 소비량: 1398 },
  { date: '1월 3일', 생산량: 2000, 소비량: 9800 },
  { date: '1월 4일', 생산량: 2780, 소비량: 3908 },
  { date: '1월 5일', 생산량: 1890, 소비량: 4800 },
  { date: '1월 6일', 생산량: 2390, 소비량: 3800 },
  { date: '1월 7일', 생산량: 3490, 소비량: 4300 },
];

const Analysis = () => {
  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />
        <h1 className="page-title">데이터 분석 및 리포트</h1>
        <p className="page-subtitle">에너지 사용량과 생산량을 분석하여 일별 추세를 확인합니다.</p>

        {/* 라인 차트를 통한 데이터 시각화 */}
        <div className="chart-wrapper">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="생산량" stroke="#8884d8" />
              <Line type="monotone" dataKey="소비량" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </header>
    </div>
  );
};

export default Analysis;
