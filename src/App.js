import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Header from "./components/Header/Header.jsx";
import Mapa from "./components/Routes/Mapa.jsx";
import Generacion from "./components/Routes/Generacion.jsx";
import Consumo from "./components/Routes/Consumo.jsx";
import Mediciones from "./components/Routes/Mediciones.jsx";
import Avisos from "./components/Routes/Avisos.jsx";
import useTheme from './hooks/useTheme.js';

function App() {
  const [theme, toggleTheme] = useTheme();
  return (
    <Router>
      <div className="App">
        <Header theme={theme} changeTheme={toggleTheme} />
        <Routes>
          <Route path="/mapa" element={<Mapa theme={theme} />} />
          <Route path="/generacion" element={<Generacion theme={theme}/>} />
          <Route path="/consumo" element={<Consumo />} />
          <Route path="/mediciones" element={<Mediciones />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/" element={<Mapa />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
