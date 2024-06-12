import React from "react";
import IP_ADDRESS from './../../misc/config.js'
import './Routes.css'
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";

const Mapa = ({ theme }) => {
  let url = `http://${IP_ADDRESS}:3000/d-solo/d2738894-e9df-45d6-91f7-11e78e5ec939/01-mapa?orgId=1&refresh=1m&theme=${theme}&panelId=12`;

  return (
    <div className="mapa-container">
      <GrafanaPanel title={"Mapa"} src={url}/>
    </div>
  );
};

export default Mapa;
