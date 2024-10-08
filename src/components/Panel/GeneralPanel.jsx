import React from "react";
import Arrows from "../AuxComponents/Arrows";
import Placa from "./../../assets/Placa.svg";
import Coche from "./../../assets/Coche.svg";
import Casas from "./../../assets/Casas.svg";
import Torre from "./../../assets/Torre.svg";
import BateriaCarga from "./../../assets/BateriaCarga.svg";
import BateriaDesCarga from "./../../assets/BateriaDescarga.svg";
import useGeneralData from "../../hooks/useGeneralData";
import { Tooltip } from "react-tooltip";
import LoadingContainer from "../AuxComponents/LoadingContainer";

const GeneralPanel = ({ id_community }) => {
  const {
    isReady,
    totalEnergy,
    consumoTotalComunidad,
    cargador,
    bateriaCarga,
  } = useGeneralData(id_community);

  if (
    !isReady ||
    totalEnergy === null ||
    consumoTotalComunidad === null ||
    cargador === null ||
    bateriaCarga === null
  ) {
    return <LoadingContainer />;
  }

  const total_energy = totalEnergy ? totalEnergy[0].total_energy : 0;
  const consumo_comunidad = consumoTotalComunidad ? consumoTotalComunidad : 0;
  const energia_cargador = cargador ? cargador[0].cargador : 0;
  const bateria_carga = bateriaCarga ? bateriaCarga[0].carga : 0;
  const diferencia = (
    -parseFloat(total_energy) +
    parseFloat(consumo_comunidad) +
    parseFloat(bateria_carga)
  ).toFixed(2);

  return (
    <div className="GeneralPanel">
      <div className="container">
        <div className="center-left">
          <div className="box">
            <img src={Placa} alt="" />
            <label
              data-tooltip-id="Generada COMUNIDAD"
              data-tooltip-content="Generada COMUNIDAD"
              data-tooltip-place="bottom"
            >
              {isNaN(total_energy)
                ? "Cargando..."
                : `${parseFloat(total_energy).toFixed(2)} kW`}
            </label>
          </div>
          <Tooltip id="Generada COMUNIDAD" />
        </div>
        <div className="center-right">
          <div className="box">
            <label
              data-tooltip-id="Cargador COMUNIDAD"
              data-tooltip-content="Cargador COMUNIDAD"
              data-tooltip-place="top"
            >
              {isNaN(energia_cargador)
                ? "Cargando..."
                : `${parseFloat(energia_cargador).toFixed(2)} kW`}
            </label>
            <img src={Coche} alt="" width={"40%"} />
            <img src={Casas} alt="" />
            <label
              data-tooltip-id="Consumida COMUNIDAD"
              data-tooltip-content="Consumida COMUNIDAD"
              data-tooltip-place="bottom"
            >
              {isNaN(consumo_comunidad)
                ? "Cargando..."
                : `${parseFloat(consumo_comunidad).toFixed(2)} kW`}
            </label>
          </div>
          <Tooltip id="Cargador COMUNIDAD" />
          <Tooltip id="Consumida COMUNIDAD" />
        </div>
        <div className="center-center">
          <Arrows count={4} degrees={-90} />
          <label>Comunidad</label>
          <h1>0000</h1>
          <Arrows count={4} degrees={-90} />
        </div>
        <div className="top-center">
          <div className="box">
            <div className="box-row">
              <div>
                <label
                  data-tooltip-id="Bateria COMUNIDAD"
                  data-tooltip-content="Batería COMUNIDAD"
                  data-tooltip-place="top"
                >
                  {isNaN(bateria_carga)
                    ? "Cargando..."
                    : `${parseFloat(bateria_carga).toFixed(2)} kW`}
                </label>
                <img
                  src={bateria_carga <= 0 ? BateriaCarga : BateriaDesCarga}
                  alt=""
                />
                <Arrows count={4} degrees={bateria_carga <= 0 ? 0 : 180} />
              </div>
            </div>
          </div>
          <Tooltip id="Bateria COMUNIDAD" />
        </div>
        <div className="bottom-center">
          <div className="box">
            <div className="box-row">
              <div>
                <Arrows count={4} degrees={diferencia <= 0 ? 0 : 180} />
                <img src={Torre} alt="" />
                <label
                  data-tooltip-id="Inyectada COMUNIDAD"
                  data-tooltip-content="Inyectada COMUNIDAD"
                  data-tooltip-place="bottom"
                >
                  {isNaN(diferencia)
                    ? "Cargando..."
                    : `${parseFloat(diferencia).toFixed(2)} kW`}
                </label>
              </div>
            </div>
          </div>
          <Tooltip id="Inyectada COMUNIDAD" />
        </div>
      </div>
    </div>
  );
};

export default GeneralPanel;
