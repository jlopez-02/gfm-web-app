import React from "react";
import GFM_logo from '../../assets/GFM_logo.png';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

const Header = ({ theme, changeTheme }) => {
  
  return (
    <div className="header">
      <nav>
        <ul>
          <li>
            <img src={GFM_logo} alt="Logo" className="logo" />
          </li>
          <li>
            <NavLink to="/mapa">Mapa</NavLink>
          </li>
          <li>
            <NavLink to="/generacion">Generación</NavLink>
          </li>
          <li>
            <NavLink to="/consumo">Consumo</NavLink>
          </li>
          <li>
            <NavLink to="/mediciones">Mediciones</NavLink>
          </li>
          <li>
            <NavLink to="/avisos">Avisos</NavLink>
          </li>

          <li className="theme-icon-li">
              <FontAwesomeIcon className="theme-icon" icon={faCircleHalfStroke} onClick={changeTheme}/>
          </li>
          
          <li className="logout">
            <a href="/" onClick={changeTheme}>
              Cerrar Sesión
            </a>
          </li>
        </ul>
        
      </nav>
      
    </div>
  );
};

export default Header;
