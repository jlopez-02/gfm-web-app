import React from "react";
import GFM2 from "../../assets/GFM2.png";
import "./Panel.css";
import useMyData from "../../hooks/useMyData";
import { Tooltip } from "react-tooltip";

const RepartoDiarioPanel = ({ id_community, type_consumer }) => {
  const { totalEnergy, countUsers, potenciaGeneracion } = useMyData(
    id_community,
    type_consumer
  );
  if (
    totalEnergy === null ||
    countUsers === null ||
    potenciaGeneracion === null
  ) {
    return <div>Loading...</div>;
  }

  const total_energy = totalEnergy ? totalEnergy[0].total_energy : 0;
  const count_Users = countUsers ? countUsers[0].count_users : 0;
  const potencia_generacion = potenciaGeneracion
    ? potenciaGeneracion[0].potencia_generacion
    : isNaN(potenciaGeneracion)
    ? 0
    : 0;

  let reparto_diario_usuario = 0;

  if (type_consumer === "industrial") {
    reparto_diario_usuario = (total_energy * 0.6) / count_Users;
  } else {
    reparto_diario_usuario = (total_energy * 0.4) / count_Users;
  }

  let parsed_potencia_generacion = parseFloat(
    potencia_generacion / 1000
  ).toFixed(2);
  let potencia_generacion_porcentage = parseFloat(
    (parsed_potencia_generacion / 15) * 100
  ).toFixed(2);

  return (
    <div className="rep-dia-panel-container">
      <div className="rep-dia-panel-sub-container">
        <img src={GFM2} alt="Interfaz Solar" />
        <div
          className="info-box info-house"
          data-tooltip-id="Reparto USUARIO"
          data-tooltip-content="Reparto USUARIO"
          data-tooltip-place="bottom"
        >
          {reparto_diario_usuario.toFixed(2)} kWh
        </div>
        <Tooltip id="Reparto USUARIO" />
        <div
          className="info-box info-solar"
          data-tooltip-id="Generada COMUNIDAD"
          data-tooltip-content="Generada COMUNIDAD"
          data-tooltip-place="top"
        >
          {parseFloat(total_energy).toFixed(2)} kWh
        </div>
        <Tooltip id="Generada COMUNIDAD" />
        <div
          className="info-box info-grid"
          data-tooltip-id="Reparto COMUNIDAD"
          data-tooltip-content="Reparto COMUNIDAD"
          data-tooltip-place="bottom"
        >
          {(total_energy - reparto_diario_usuario).toFixed(2)} kWh
        </div>
        <Tooltip id="Reparto COMUNIDAD" />
        <div
          className="info-box info-power"
          data-tooltip-id="Potencia ACTUAL COMUNIDAD"
          data-tooltip-content="Potencia ACTUAL COMUNIDAD"
          data-tooltip-place="top"
        >
          <div>{parsed_potencia_generacion} kW</div>
          <div>{potencia_generacion_porcentage}%</div>
        </div>
        <Tooltip id="Potencia ACTUAL COMUNIDAD" />
      </div>
    </div>
  );
};

export default RepartoDiarioPanel;
