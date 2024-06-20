import React, { useState } from "react";
import "./Panel.css";
import NumberTextField from "../Textfield/NumberTextfield";

const ResumenPanel = () => {
  const [precioDia, setPrecioDia] = useState(4);
  return (
    <div className="resumen-panel-container">
      <div className="resumen-panel-sub-container">
        <div className="summary-container">
          <h2 className="title">RESUMEN</h2>
          <div className="date-time">10/02/2023 16:48</div>
          <div className="summary-item highlight">
            <span>ENERGÍA CONSUMIDA TOTAL</span>
            <span>8.4 kWh</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA CONSUMIDA DESDE LA RED</span>
            <span>3.8 kWh</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA CONSUMIDA DE LA COMUNIDAD</span>
            <span>4.6 kWh</span>
          </div>
          <div className="summary-item highlight">
            <span>RATIO DE AUTOCONSUMO</span>
            <span>54%</span>
          </div>
          <div className="summary-item"></div>
          <div className="summary-item">
            <NumberTextField
              label={"Coste diario"}
              min={0}
              max={3650}
              value={precioDia}
              onChange={setPrecioDia}
              outLabel="€/kWh"
            />
            <span className="total-saved">TOTAL AHORRADO HOY: 3.61€</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenPanel;
