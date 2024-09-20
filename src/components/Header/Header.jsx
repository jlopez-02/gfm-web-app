import React from "react";
import GFM_logo from "../../assets/GFM_logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleHalfStroke,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import LoginDropdown from "../Dropdown/LoginDropdown";
import useLoginData from "../../hooks/useLoginData";
import IP_ADDRESS from "../../misc/config";

const Header = ({
  changeTheme,
  reloadComponents,
  userRole,
  handleLogout,
  userName,
  community,
  type_consumer,
  name_label,
  setIdUsuarioPanel,
  setUserRoleUsuarioPanel,
  setTypeConsumerUsuarioPanel
}) => {
  const { data, selectedItem, setSelectedItem } = useLoginData();
  const location = useLocation();
  
  const onButtonClick = () => {

    const query = `select ID, role_USER, type_CONSUMER from user_info where ID='${selectedItem.id}' order by desc LIMIT 1`;
    const url = `http://${IP_ADDRESS}:8086/query?db=user_info&q=${encodeURIComponent(
      query
    )}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(":"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.results[0]?.series) {
          const userExists = data.results[0]?.series[0]?.values.length > 0;
          if (userExists) {
            const user = data.results[0]?.series[0]?.values[0];
            const [
              ,
              // time
              id,
              role_USER,
              type_consumer,
            ] = user;

            setIdUsuarioPanel(id);
            setUserRoleUsuarioPanel(role_USER);
            setTypeConsumerUsuarioPanel(type_consumer);

          } else {
          }
        } else {
          
        }
      })
      .catch((error) => {
        console.error("Error querying InfluxDB:", error);
        alert("Error al iniciar sesión");
      });

      console.log("click");
      
  };

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
          {(userRole === "admin" || type_consumer !== "residencial") && (
            <li>
              <NavLink to="/generacion" onClick={reloadComponents}>
                Generación
              </NavLink>
            </li>
          )}
          {(userRole === "admin" ||
            (userRole === "user" && type_consumer === "residencial")) && (
            <li>
              <NavLink to="/consumo" onClick={reloadComponents}>
                Consumo
              </NavLink>
            </li>
          )}
          {(userRole === "user" || userRole === "admin") && (
            <li>
              <NavLink to="/usuario" onClick={reloadComponents}>
                Usuario
              </NavLink>
            </li>
          )}
          {(userRole === "user" || userRole === "admin") && (
            <li>
              <NavLink to="/comunidad" onClick={reloadComponents}>
                Comunidad
              </NavLink>
            </li>
          )}
          {(userRole === "user" || userRole === "admin") && (
            <li>
              <NavLink to="/avisos" onClick={reloadComponents}>
                Avisos
              </NavLink>
            </li>
          )}

          {location.pathname === "/usuario" && userRole === "admin" && (
            <li className="user-data-header separator">
              <LoginDropdown
                label={""}
                data={data}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                admin={true}
                onClick={onButtonClick}
              />
            </li>
          )}

          <li className="user-data-header separator">
            <FontAwesomeIcon icon={faUsers} />
            <label>{community}</label>
          </li>
          <li className="user-data-header">
            <FontAwesomeIcon icon={faUser} />
            <label>{name_label}</label>
          </li>

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
