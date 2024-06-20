import React from "react";
import GFM1 from "../../assets/GFM1.png";
import "./Panel.css";
import useMyData from "../../hooks/useMyData";

const MisConsumosPanel = () => {

  const {consumption, production } = useMyData();

  if (!consumption || !production) {
    return <div>Loading...</div>;
  }

  const consumo = consumption[0].consumo; 
  const produccion = production[0].produccion;
  const diferencia = parseFloat(consumption[0].consumo - production[0].produccion).toFixed(2);

  return (
    <div className="mis-consumos-panel-container">
      <div className="mis-consumos-panel-sub-container">
        <img src={GFM1} alt="Interfaz Solar" />
        <div className="info-box info-house">{consumo} kWh</div>
        <div className="info-box info-solar">{produccion} kWh</div>
        <div className="info-box info-grid">{diferencia} kWh </div>
      </div>
    </div>
  );
};

export default MisConsumosPanel;