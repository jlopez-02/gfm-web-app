import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Header/Header.jsx";
import Mapa from "./components/Routes/Mapa.jsx";
import Generacion from "./components/Routes/Generacion.jsx";
import Consumo from "./components/Routes/Consumo.jsx";
import Mediciones from "./components/Routes/Mediciones.jsx";
import Avisos from "./components/Routes/Avisos.jsx";
import useTheme from './hooks/useTheme.js';

function App() {
  const [loadKey, setLoadKey] = useState(1);
  const [loaded, setLoaded] = useState(false);

  const [delayedLoad, setDelayedLoad] = useState(false);

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
  
  return (
    <Router>
      <div className="App">
        <Header theme={theme} changeTheme={toggleTheme} reloadComponents={reloadComponents}/>
        <Routes>
          <Route path="/mapa" element={<Mapa theme={theme} />} />
          <Route path="/generacion" element={<Generacion theme={theme} handleLoad={handleLoad} loaded={loaded} delayedLoad={delayedLoad} loadKey={loadKey}/>}/>
          <Route path="/consumo" element={<Consumo theme={theme} handleLoad={handleLoad} loaded={loaded} delayedLoad={delayedLoad} loadKey={loadKey}/>}/>
          <Route path="/mediciones" element={<Mediciones />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/" element={<Mapa />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
