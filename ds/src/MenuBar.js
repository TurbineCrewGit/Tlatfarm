// MenuBar.js

import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Styles/Menubar.css"; // 메뉴 바 스타일 임포트
import ThemeToggle from "./Components/ThemeToggle";

const MenuBar = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 메뉴 열고 닫기 핸들러
  // const toggleMenu = useCallback(() => {
  //   setIsMenuOpen(prevState => !prevState);
  // }, []);

  return (
    <>
      {/* 메뉴 버튼을 메뉴가 닫혀 있을 때만 표시 */}
      {/*       {!isMenuOpen && (
        <button
          className="menu-button"
          onClick={toggleMenu}
          aria-label="메뉴 열기"
        >
          &#x2630;
        </button>
)} */}

      {/* 메뉴바 */}

      {/*     <div className={`menu-bar ${isMenuOpen ? 'open' : ''}`}>
        
        <button
          className="close-button"
               onClick={toggleMenu}
          aria-label="메뉴 닫기"
        >*
          &times;
        </button> */}
      <div className={`menu-bar open`}>
        <nav>
          <ul>
            <li>
              <Link to="/">Main</Link>
            </li>
            <li>
              <Link to="/Clebinepage">Clebine</Link>
            </li>
            <li>
              <Link to="/Smartdronepage">Smartdrone</Link>
            </li>
            <li>
              <Link to="/Managementpage">농작물관리</Link>
            </li>
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </>
  );
};

export default MenuBar;
