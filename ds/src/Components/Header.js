import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Styles/images/dark_logo.png';
import MenuBar from '../MenuBar';

function Header() {
  return (
    <header className="header">
      <Link to='/'style={{width:'350px', height:'150px'}} >
        <img src={logo} alt="Turbine Planner" style={{width:'100%', height:'100%'}} />
      </Link>
      <MenuBar />
    </header>
  );
}
 

export default Header;