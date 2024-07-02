import React from "react";
import Arrows from "../AuxComponents/Arrows";
import Placa from "./../../assets/Placa.svg";
import Coche from "./../../assets/Coche.svg";
import Casas from "./../../assets/Casas.svg";
import Torre from "./../../assets/Torre.svg";
import useGeneralData from "../../hooks/useGeneralData";

const GeneralPanel = ({id_community}) => {

  const { totalEnergy, energy } = useGeneralData(id_community);

  if (totalEnergy === null || energy === null) {
    return <div>Loading...</div>;
  }

  const total_energy = totalEnergy ? totalEnergy[0].total_energy : 0;
  const energy_general = energy ? (energy[0].energy / 1000) : 0;

  const diferencia = energy_general - total_energy;

  return (
    <div className="GeneralPanel">
      <div className="container">
        <div className="top-left">
          <div className="box yellow">
            <img src={Placa} alt="" />
            <label>{parseFloat(total_energy).toFixed(2)} kWh</label>
          </div>
        </div>
        <div className="top-right">
          <div className="box orange">
            <img src={Casas} alt="" />
            <label>{parseFloat(energy_general).toFixed(2)} kWh</label>
          </div>
        </div>
        <div className="bottom-left">
          <div className="box red">
            <img src={Torre} alt="" />
            <label>{parseFloat(diferencia).toFixed(2)} kWh</label>
          </div>
        </div>
        <div className="bottom-right">
          <div className="box orange">
            <img src={Coche} alt="" />
            <label>No data kWh</label>
          </div>
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
