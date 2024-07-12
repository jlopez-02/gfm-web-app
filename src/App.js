import "./App.css";
import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header.jsx";
import Mapa from "./components/Routes/Mapa.jsx";
import Generacion from "./components/Routes/Generacion.jsx";
import Consumo from "./components/Routes/Consumo.jsx";
import useTheme from "./hooks/useTheme.js";
import MisDatos from "./components/Routes/MisDatos.jsx";
import "./components/Routes/Mapa.css";
import "./components/Routes/Generacion.css";
import "./components/Routes/MisDatos.css";
import General from "./components/Routes/General.jsx";
import Avisos from "./components/Routes/AvisosUser.jsx";
import AvisosAdmin from "./components/Routes/AvisosAdmin.jsx";
import "./components/Routes/General.css";
import LoginForm from "./components/LoginForm/LoginForm.jsx"; // Importa el componente de login
import ProtectedRoute from "./components/AuxComponents/ProtectedRoute.jsx"; // Importa el componente de ruta protegida
import Mediciones from "./components/Routes/Mediciones.jsx";
import Popup from "./components/PopUp/Popup.jsx";
import Cargador from "./components/Routes/Cargador.jsx";

function App() {
  const [loadKey, setLoadKey] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [delayedLoad, setDelayedLoad] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loginUsername, setLoginUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [user_id, setUserId] = useState(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupUrl, setPopupUrl] = useState("");

  const openPopup = (url) => {
    setPopupUrl(url);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupUrl("");
  };

  const [community_id, setCommunityId] = useState(null);
  const [type_consumer, setTypeConsumer] = useState(null);

  const handleLoad = () => {
    setLoaded(true);
    setTimeout(() => {
      setDelayedLoad(true);
    }, 1000);
  };

  const reloadComponents = () => {
    setLoadKey(loadKey + 1);
    setLoaded(false);
    setDelayedLoad(false);
  };

  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    const loginUsername = localStorage.getItem("name_user");
    const auth = localStorage.getItem("auth");
    const role = localStorage.getItem("role");
    const user_id = localStorage.getItem("user_id");
    const community_id = localStorage.getItem("community_id");
    const type_consumer = localStorage.getItem("type_consumer");

    setLoginUserName(loginUsername);
    setIsAuth(auth === "true");
    setUserRole(role);
    setUserId(user_id);
    setCommunityId(community_id);
    setTypeConsumer(type_consumer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("name_user");
    localStorage.removeItem("auth");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("community_id");
    localStorage.removeItem("type_consumer");

    setLoginUserName(null);
    setIsAuth(false);
    setUserRole(null);
    setUserId(null);
    setCommunityId(null);
    setTypeConsumer(null);
  };

  return (
    <Router>
      <div className="App">
        {isAuth ? (
          <>
            <Header
              theme={theme}
              changeTheme={toggleTheme}
              reloadComponents={reloadComponents}
              userRole={userRole}
              handleLogout={handleLogout}
              userName={loginUsername}
              community={community_id}
            />
            <Routes>
              <Route
                path="/mapa"
                element={
                  <ProtectedRoute isAuth={isAuth}>
                    <Mapa theme={theme} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/generacion"
                element={
                  <ProtectedRoute isAuth={isAuth}>
                    <Generacion
                      theme={theme}
                      handleLoad={handleLoad}
                      loaded={loaded}
                      delayedLoad={delayedLoad}
                      loadKey={loadKey}
                      id_community={community_id}
                      openPopup={openPopup}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/consumo"
                element={
                  <ProtectedRoute isAuth={isAuth}>
                    <Consumo
                      theme={theme}
                      handleLoad={handleLoad}
                      loaded={loaded}
                      delayedLoad={delayedLoad}
                      loadKey={loadKey}
                      id_community={community_id}
                      openPopup={openPopup}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mediciones"
                element={
                  <ProtectedRoute isAuth={isAuth}>
                    <Mediciones />
                  </ProtectedRoute>
                }
              />

              {/* <Route
                path="/avisos"
                element={
                  <ProtectedRoute isAuth={isAuth}>
                    <AvisosAdmin />
                  </ProtectedRoute>
                }
              /> */}
              <Route
                path="/usuario"
                element={
                  <ProtectedRoute isAuth={isAuth}>
                    <MisDatos
                      theme={theme}
                      id_community={community_id}
                      type_consumer={type_consumer}
                      logged_user={loginUsername}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/comunidad"
                element={
                  <ProtectedRoute isAuth={isAuth}>
                    <General
                      theme={theme}
                      id_community={community_id}
                      openPopup={openPopup}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/avisos"
                element={
                  <ProtectedRoute isAuth={isAuth}>
                    <Cargador
                      theme={theme}
                      id_community={community_id}
                      openPopup={openPopup}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/avisos_user"
                element={
                  <ProtectedRoute isAuth={isAuth}>
                    <Avisos />
                  </ProtectedRoute>
                }
              />
              {userRole === "admin" ? (
                <Route path="*" element={<Navigate to="/mapa" />} />
              ) : (
                <Route path="*" element={<Navigate to="/usuario" />} />
              )}
              <Route path="*" element={<Navigate to="/mapa" />} />
            </Routes>
            {isPopupOpen && <Popup url={popupUrl} onClose={closePopup} />}
          </>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={
                <LoginForm
                  setLoginUserName={setLoginUserName}
                  setIsAuth={setIsAuth}
                  setUserRole={setUserRole}
                  setUserId={setUserId}
                  setCommunityId={setCommunityId}
                  setTypeConsumer={setTypeConsumer}
                />
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
