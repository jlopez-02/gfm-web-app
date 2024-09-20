import React, { useState } from "react";
import "./LoginForm.css"; // Asegúrate de tener un archivo CSS para las clases
import GFM_logo from "../../assets/GFM_logo.png";
import IP_ADDRESS from "./../../misc/config";
import Dropdown from "../Dropdown/Dropdown";
import useLoginData from "../../hooks/useLoginData";
import LoginDropdown from "../Dropdown/LoginDropdown";

const LoginForm = ({
  setId,
  setLoginUserName,
  setNameLabel,
  setIsAuth,
  setUserRole,
  setUserId,
  setCommunityId,
  setTypeConsumer,
}) => {
  const { data, selectedItem, setSelectedItem } = useLoginData();

  const [userName, setUsername] = useState("");

  const [mensajeError, setMensajeError] = useState("");

  const reloadErrorMessages = () => {
    setMensajeError("");
  };

  const onButtonClick = () => {
    reloadErrorMessages();

    const query = `select ID, name_USER, name_label, role_USER, ID_USER, ID_COMMUNITY, type_CONSUMER from user_info where ID='${selectedItem.id}' order by desc LIMIT 1`;
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
              name_USER,
              name_label,
              role_USER,
              id_user,
              id_community,
              type_consumer,
            ] = user;

            // if (password === password_USER) {
            localStorage.setItem("id", id);
            localStorage.setItem("name_user", name_USER);
            localStorage.setItem("name_label", name_label);
            localStorage.setItem("auth", "true");
            localStorage.setItem("role", role_USER);
            localStorage.setItem("user_id", id_user);
            localStorage.setItem("community_id", id_community);
            localStorage.setItem("type_consumer", type_consumer);

            setId(id);
            setLoginUserName(name_USER);
            setNameLabel(name_label);
            setIsAuth(true);
            setUserRole(role_USER);
            setUserId(id_user);
            setCommunityId(id_community);
            setTypeConsumer(type_consumer);

            // } else {
            //   setPasswordError("Contraseña incorrecta");
            // }
          } else {
            setMensajeError("Credenciales incorrectas");
          }
        } else {
          setMensajeError("El usuario no existe");
        }
      })
      .catch((error) => {
        console.error("Error querying InfluxDB:", error);
        alert("Error al iniciar sesión");
      });
  };

  return (
    <div className={"loginMainContainer"}>
      <div className="loginFormContainer">
        <div className={"titleContainer"}>
          <img src={GFM_logo} alt="" />
          {/* <div>Iniciar Sesión</div> */}
          <LoginDropdown
            label={""}
            data={data}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>
        {/* <br />
        <div className={"inputContainer"}>
          <input
            value={userName}
            placeholder="Usuario"
            onChange={(ev) => setUsername(ev.target.value)}
            className={"inputBox"}
          />
          <label className="errorLabel">{userError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
          <input
            type="password"
            value={password}
            placeholder="Contraseña"
            onChange={(ev) => setPassword(ev.target.value)}
            className={"inputBox"}
          />
          <label className="errorLabel">{passwordError}</label>
          <label className="errorLabel">{mensajeError}</label>
        </div> */}

        <br />
        <div className={"inputContainer"}>
          <input
            className={"inputButton"}
            type="button"
            onClick={onButtonClick}
            value={"Iniciar Sesión"}
          />
          {/* <br></br>
          <div>
            <input
              className={"inputButton"}
              type="button"
              onClick={provisionalAdmin}
              value={"Admin"}
            />
            <input
              className={"inputButton"}
              type="button"
              onClick={provisionalUser}
              value={"User"}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
