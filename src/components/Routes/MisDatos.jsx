import React from "react";
import MisConsumosPanel from "../Panel/MisConsumosPanel";
import RepartoDiarioPanel from "../Panel/RepartoDiarioPanel";
import ResumenPanel from "../Panel/ResumenPanel";

const MisDatos = ({id_community, type_consumer}) => {
  return (
    <div className="mis-datos-container">
      <div className="mis-consumos-container">
        <div className="mis-consumos-panel-main">
          <MisConsumosPanel id_community={id_community} />
          <ResumenPanel />
        </div>
        
      </div>
      <div className="rep-diario-container">
        <RepartoDiarioPanel id_community={id_community} type_consumer={type_consumer}/>
      </div>
    </div>
  );
};

export default MisDatos;
