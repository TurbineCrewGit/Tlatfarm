// Trading.js

import React, { useState } from 'react';
import './Styles/App.css';
import MenuBar from './MenuBar';

const Trading = () => {
  // 샘플 거래 데이터
  const [trades, setTrades] = useState([
    { id: 1, seller: 'Seller A', buyer: 'Buyer B', price: 100, status: '매칭 완료' },
    { id: 2, seller: 'Seller C', buyer: 'Buyer D', price: 150, status: '입찰 중' },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />

        <h1 className="trading-title">거래 플랫폼</h1>
        <p className="trading-subtitle">에너지 거래 상황을 확인하고 매칭 및 입찰을 진행합니다.</p>

        {/* 거래 목록 테이블 */}
        <table className="trading-table">
          <thead>
            <tr>
              <th>거래 ID</th>
              <th>판매자</th>
              <th>구매자</th>
              <th>가격</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td>{trade.id}</td>
                <td>{trade.seller}</td>
                <td>{trade.buyer}</td>
                <td>{trade.price}원</td>
                <td>{trade.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
};

export default Trading;
