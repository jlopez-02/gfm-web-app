import React, {useEffect, useState} from "react";
import GeneralPanel from "../Panel/GeneralPanel";
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";
import generateGrafanaUrls from "./../../misc/grafana_urls";

const General = ({ theme, delayedLoad, handleLoad }) => {
  const [panelsLoaded, setPanelsLoaded] = useState({});
  
  useEffect(() => {
    if (
      Object.keys(panelsLoaded).length === 6 &&
      Object.values(panelsLoaded).every((value) => value === true)
    ) {
      handleLoad();
    }
  }, [handleLoad, panelsLoaded]);

  const handlePanelLoad = (panelTitle) => {
    setPanelsLoaded((prev) => ({ ...prev, [panelTitle]: true }));
  };
  const urls = generateGrafanaUrls(theme);

  return (
    <div className="general-container">
      <div className="c1-general-container">
        <div className="a">
          <GeneralPanel />
        </div>
      </div>
      <div className="c2-general-container">
        <div className="b">
          <GrafanaPanel
            title={"AllClientsTable"}
            src={urls.gen_table_url}
            onLoad={() => handlePanelLoad("AllClientsTable")}
          />
        </div>
        <div className="c">
          <GrafanaPanel title={"Mapa"} src={urls.map_map_url} />
        </div>
      </div>
    </div>
  );
};

export default General;
