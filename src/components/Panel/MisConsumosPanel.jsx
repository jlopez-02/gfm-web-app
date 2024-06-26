import React from "react";
import GFM1 from "../../assets/GFM1.png";
import "./Panel.css";
import useMyData from "../../hooks/useMyData";
import Arrows from "../AuxComponents/Arrows";

const MisConsumosPanel = ({id_community}) => {
  const { consumption, production } = useMyData(id_community);

  if (consumption === null || production === null) {
    return <div>Loading...</div>;
  }

  const consumo = consumption ? consumption[0].consumo : 0;
  const produccion = production ? production[0].produccion : 0;
  const diferencia = (parseFloat(consumo) - parseFloat(produccion)).toFixed(2);

  return (
    <div className="mis-consumos-panel-container">
      <div className="mis-consumos-panel-sub-container">
        <div className="arrow-box">
          <div>
            <Arrows count={5} degrees={-90} />
          </div>
        </div>
        <img src={GFM1} alt="Interfaz Solar" />
        <div className="info-box info-house">{parseFloat(consumo).toFixed(2)} kWh</div>
        <div className="info-box info-solar">{parseFloat(produccion).toFixed(2)} kWh</div>
        <div className="info-box info-grid">{diferencia} kWh </div>
      </div>
    </div>
  );
};

export default MisConsumosPanel;
