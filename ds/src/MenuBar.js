// MenuBar.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Styles/Menubar.css"; // 메뉴 바 스타일 임포트
import ThemeToggle from "./Components/ThemeToggle";

const MenuBar = () => {
  return (
    <div className={`menu-bar open sidemenu`}>
      <nav>
        <img alt="LogoPlaceHolder" />
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
    </div>
  );
};

export default MenuBar;
