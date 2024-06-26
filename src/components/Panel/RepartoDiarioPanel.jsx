import React from "react";
import GFM2 from "../../assets/GFM2.png";
import "./Panel.css";
import useMyData from "../../hooks/useMyData";

const RepartoDiarioPanel = ({id_community, type_consumer}) => {

  const {totalEnergy, countUsers, potenciaGenerada } = useMyData(id_community, type_consumer);

  if (totalEnergy === null || countUsers === null || potenciaGenerada === null) {
    return <div>Loading...</div>;
  }

  const total_energy = totalEnergy ? totalEnergy[0].total_energy: 0;
  const count_Users = countUsers ? countUsers[0].count_users : 0;
  const potencia_generacion = potenciaGenerada ? potenciaGenerada[0].potencia_generacion : 0;

  let reparto_diario_usuario = 0;

  if(type_consumer === 'industrial'){
    reparto_diario_usuario = (total_energy * 0.6) / count_Users;
  }else{
    reparto_diario_usuario = (total_energy * 0.4) / count_Users;
  }

  return (
    <div className="rep-dia-panel-container">
      <div className="rep-dia-panel-sub-container">
        <img src={GFM2} alt="Interfaz Solar" />
        <div className="info-box info-house">{reparto_diario_usuario.toFixed(2)} kWh</div>
        <div className="info-box info-solar">{parseFloat(total_energy).toFixed(2)} kWh</div>
        <div className="info-box info-grid">{(total_energy- reparto_diario_usuario).toFixed(2)} kWh</div>
        <div className="info-box info-power">{parseFloat(potencia_generacion).toFixed(2)} kW</div>
      </div>
    </div>
  );
};

export default RepartoDiarioPanel;