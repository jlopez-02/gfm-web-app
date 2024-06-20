import "./App.css";
import './App.scss';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header.jsx";
import Mapa from "./components/Routes/Mapa.jsx";
import Generacion from "./components/Routes/Generacion.jsx";
import Consumo from "./components/Routes/Consumo.jsx";
import useTheme from './hooks/useTheme.js';
import MisDatos from "./components/Routes/MisDatos.jsx";
import './components/Routes/Mapa.css'
import './components/Routes/Generacion.css'
import './components/Routes/MisDatos.css'
import General from "./components/Routes/General.jsx";
import './components/Routes/General.css';

function App() {
  const [loadKey, setLoadKey] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [delayedLoad, setDelayedLoad] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

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
  }

  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    setIsAuth(auth === 'true');
  }, []);
  
  return (
    <Router>
      <div className="App">
        <Header theme={theme} changeTheme={toggleTheme} reloadComponents={reloadComponents}/>
        <Routes>
          <Route path="/mapa" element={<Mapa theme={theme} />} />
          <Route path="/generacion" element={<Generacion theme={theme} handleLoad={handleLoad} loaded={loaded} delayedLoad={delayedLoad} loadKey={loadKey}/>}/>
          <Route path="/consumo" element={<Consumo theme={theme} handleLoad={handleLoad} loaded={loaded} delayedLoad={delayedLoad} loadKey={loadKey}/>}/>
          <Route path="/mediciones" element={<General theme={theme}/>} />
          <Route path="/avisos" element={<MisDatos />} />
          <Route path="/" element={<Mapa />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
