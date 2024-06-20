import React from "react";
import GFM2 from "../../assets/GFM2.png";
import "./Panel.css";
import useMyData from "../../hooks/useMyData";

const MisConsumosPanel = () => {

  const { consumption, production } = useMyData();

  if (!consumption || !production) {
    return <div>Loading...</div>;
  }

  const consumo = consumption[0].consumo; 
  const produccion = production[0].produccion;
  const diferencia = parseFloat(consumption[0].consumo - production[0].produccion).toFixed(2);

  return (
    <div className="rep-dia-panel-container">
      <div className="rep-dia-panel-sub-container">
        <img src={GFM2} alt="Interfaz Solar" />
        <div className="info-box info-house">{consumo} kWh</div>
        <div className="info-box info-solar">{produccion} kWh</div>
        <div className="info-box info-grid">{diferencia} kWh </div>
      </div>
    </div>
  );
};

export default MisConsumosPanel;