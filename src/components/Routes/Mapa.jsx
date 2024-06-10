import React from "react";
import './Routes.css'

const Mapa = ({ theme }) => {
  let url = `http://localhost:3000/d-solo/d2738894-e9df-45d6-91f7-11e78e5ec939/01-mapa?orgId=1&refresh=1m&theme=${theme}&panelId=12`;

  return (
    <div className="mapa-container">
      <iframe
        title="Mapa"
        src={url}
        frameBorder={0}
        style={{ width: "80%", height: "80%" }}
      ></iframe>
    </div>
  );
};

export default Mapa;
