import React from "react";
import GFM_logo from "../../assets/GFM_logo.png";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleHalfStroke,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

const Header = ({
  changeTheme,
  reloadComponents,
  userRole,
  handleLogout,
  userName,
  community,
}) => {
  return (
    <div className="header">
      <nav>
        <ul>
          <li>
            <img src={GFM_logo} alt="Logo" className="logo" />
          </li>
          {userRole === "admin" && (
            <li>
              <NavLink to="/mapa" onClick={reloadComponents}>
                Mapa
              </NavLink>
            </li>
          )}
          {userRole === "admin" && (
            <li>
              <NavLink to="/generacion" onClick={reloadComponents}>
                Generación
              </NavLink>
            </li>
          )}
          {userRole === "admin" && (
            <li>
              <NavLink to="/consumo" onClick={reloadComponents}>
                Consumo
              </NavLink>
            </li>
          )}
          {userRole === "user" && (
            <li>
              <NavLink to="/usuario" onClick={reloadComponents}>
                Usuario
              </NavLink>
            </li>
          )}
          {userRole === "user" && (
            <li>
              <NavLink to="/comunidad" onClick={reloadComponents}>
                Comunidad
              </NavLink>
            </li>
          )}
          {userRole === "user" && (
            <li>
              <NavLink to="/cargador" onClick={reloadComponents}>
                Cargador
              </NavLink>
            </li>
          )}

          <li className="user-data-header separator">
            <FontAwesomeIcon icon={faUsers} />
            <label>{community}</label>
          </li>
          <li className="user-data-header">
            <FontAwesomeIcon icon={faUser} />
            <label>{userName}</label>
          </li>
          {/* <li className="theme-icon-li">
            <FontAwesomeIcon
              className="theme-icon"
              icon={faCircleHalfStroke}
              onClick={() => {
                changeTheme();
                reloadComponents();
              }}
            />
          </li> */}

          <li className="logout">
            <a href="/" onClick={handleLogout}>
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
