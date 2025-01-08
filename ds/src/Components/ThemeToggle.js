// ThemeToggle.js
import React, { useState, useEffect, useCallback } from 'react';

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 초기 다크 모드 상태 확인
    return document.body.classList.contains('dark-mode');
  });

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      return newMode;
    });
  }, []);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 현재 테마를 설정
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <button className="btn btn-theme-toggle" onClick={toggleTheme}>
      {isDarkMode ? 'Light' : 'Dark'}
    </button>
  );
}

export default ThemeToggle;
