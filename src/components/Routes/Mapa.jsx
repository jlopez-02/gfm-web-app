import React from "react";
import './Routes.css'
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";
import generateGrafanaUrls from "./../../misc/grafana_urls";

const Mapa = ({ theme }) => {

  const urls = generateGrafanaUrls(theme);

  return (
    <div className="mapa-container">
      <GrafanaPanel title={"Mapa"} src={urls.map_map_url}/>
    </div>
  );
};

export default Mapa;
