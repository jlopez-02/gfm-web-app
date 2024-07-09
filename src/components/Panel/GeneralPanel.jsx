import React from "react";
import Arrows from "../AuxComponents/Arrows";
import Placa from "./../../assets/Placa.svg";
import Coche from "./../../assets/Coche.svg";
import Casas from "./../../assets/Casas.svg";
import Torre from "./../../assets/Torre.svg";
import useGeneralData from "../../hooks/useGeneralData";
import { Tooltip } from "react-tooltip";

const GeneralPanel = ({ id_community }) => {
  const { totalEnergy, consumoTotalComunidad, cargador, energia_inyectada } =
    useGeneralData(id_community);

  if (
    totalEnergy === null ||
    consumoTotalComunidad === null ||
    cargador === null ||
    energia_inyectada === null
  ) {
    return <div>Loading...</div>;
  }

  const total_energy = totalEnergy ? totalEnergy[0].total_energy : 0;
  const consumo_general = consumoTotalComunidad
    ? consumoTotalComunidad[0].cons
    : 0;
  const var_cargador = cargador ? cargador[0].cargador : 0;
  const energia_inyect = energia_inyectada
    ? energia_inyectada[0].energia_inyectada
    : 0;

  const diferencia = parseFloat(total_energy - energia_inyect).toFixed(2);

  return (
    <div className="GeneralPanel">
      <div className="container">
        <div className="top-left">
          <div className="box yellow">
            <img src={Placa} alt="" />
            <label
              data-tooltip-id="Generada COMUNIDAD"
              data-tooltip-content="Generada COMUNIDAD"
              data-tooltip-place="bottom"
            >
              {parseFloat(total_energy).toFixed(2)} kWh
            </label>
          </div>
          <Tooltip id="Generada COMUNIDAD" />
        </div>
        <div className="top-right">
          <div className="box orange">
            <img src={Casas} alt="" />
            <label
              data-tooltip-id="Consumida COMUNIDAD"
              data-tooltip-content="Consumida COMUNIDAD"
              data-tooltip-place="bottom"
            >
              {parseFloat(consumo_general).toFixed(2)} kWh
            </label>
          </div>
          <Tooltip id="Consumida COMUNIDAD" />
        </div>
        <div className="bottom-left">
          <div className="box red">
            <img src={Torre} alt="" />
            <label
              data-tooltip-id="Inyectada COMUNIDAD"
              data-tooltip-content="Inyectada COMUNIDAD"
              data-tooltip-place="bottom"
            >
              {diferencia} kWh
            </label>
          </div>
          <Tooltip id="Inyectada COMUNIDAD" />
        </div>
        <div className="bottom-right">
          <div className="box orange">
            <img src={Coche} alt="" />
            <label
              data-tooltip-id="Punto RECARGA COMUNIDAD"
              data-tooltip-content="Punto RECARGA COMUNIDAD"
              data-tooltip-place="bottom"
            >
              {parseFloat(var_cargador).toFixed(2)} kWh
            </label>
          </div>
          <Tooltip id="Punto RECARGA COMUNIDAD" />
        </div>

        <div className="center-center">
          <div className="centered-box">
            <Arrows count={10} />
          </div>
        </div>
        <div className="top-center">
          <div className="centered-box">
            <Arrows count={10} degrees={-90} />
          </div>
        </div>
        <div className="bottom-center">
          <div className="centered-box">
            <Arrows count={10} degrees={-90} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPanel;
