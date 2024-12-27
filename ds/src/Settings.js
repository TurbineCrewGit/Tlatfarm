// Settings.js

import React, { useState } from 'react';
import './Styles/App.css'; // 통합된 CSS 파일 임포트
import MenuBar from './MenuBar';

const Settings = () => {
  // 샘플 사용자 데이터
  const [users, setUsers] = useState([
    { id: 1, name: '관리자', role: 'Admin' },
    { id: 2, name: '사용자 A', role: 'User' },
    { id: 3, name: '사용자 B', role: 'User' },
  ]);

  // 사용자 역할 변경 함수
  const changeRole = (id, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <MenuBar />

        <h1 className="page-title">설정 및 사용자 관리</h1>
        <p className="page-subtitle">시스템 설정 및 사용자 권한을 관리합니다.</p>

        {/* 사용자 목록 및 역할 변경 */}
        <div className="settings-container">
          <h2 className="section-title">사용자 관리</h2>
          <table className="settings-table">
            <thead>
              <tr>
                <th>사용자 ID</th>
                <th>이름</th>
                <th>역할</th>
                <th>역할 변경</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                    >
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
};

export default Settings;
