import React from "react";
import MisConsumosPanel from "../Panel/MisConsumosPanel";
import RepartoDiarioPanel from "../Panel/RepartoDiarioPanel";
import ResumenPanel from "../Panel/ResumenPanel";

const MisDatos = () => {
  return (
    <div className="mis-datos-container">
      <div className="mis-consumos-container">
        <div className="mis-consumos-panel-main">
          <MisConsumosPanel />
          <ResumenPanel/>
        </div>
        
      </div>
      <div className="rep-diario-container">
        <RepartoDiarioPanel />
      </div>
    </div>
  );
};

export default MisDatos;
