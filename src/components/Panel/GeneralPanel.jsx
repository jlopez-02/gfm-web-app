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
        <div className="center-left">
          <div className="box">
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
        <div className="center-right">
          <div className="box">
          <label>0000 kWh</label>
            <img src={Coche} alt="" width={"40%"}/>
            <img src={Casas} alt="" />
            <label>0000 kWh</label>
          </div>
          <Tooltip id="Consumida COMUNIDAD" />
        </div>
        <div className="center-center">
          <Arrows count={10} degrees={90} />
        </div>
        <div className="top-center">
        <div className="box">
            <div className="box-row">
              <div>
                <label>0000 kWh</label>
                <img src={BateriaDesCarga} alt="" />
                <Arrows count={4} degrees={180} />
              </div>
              <div>
                <label>0000 kWh</label>
                <img src={BateriaCarga} alt="" />
                <Arrows count={4} degrees={0} />
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-center">
          <div className="box">
            <div className="box-row">
              <div>
                <Arrows count={4} degrees={180} />
                <img src={Torre} alt="" />
                <label>0000 kWh</label>
              </div>
              <div>
                <Arrows count={4} degrees={0} />
                <img src={Torre} alt="" />
                <label>0000 kWh</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPanel;
