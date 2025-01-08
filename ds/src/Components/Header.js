import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Styles/images/dark_logo.png';
import MenuBar from '../MenuBar';

function Header() {
  return (
    <header className="header">
      <Link to='/'>
        <img src={logo} alt="Turbine Planner" width='350px' style={{marginTop:'20px', marginBottom:'10px'}} />
      </Link>
      <MenuBar />
    </header>
  );
}
 

export default Header;