import React, {useEffect, useState} from "react";
import GeneralPanel from "../Panel/GeneralPanel";
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";
import generateGrafanaUrls from "./../../misc/grafana_urls";

const Cargador = ({ theme, delayedLoad, handleLoad, id_community, openPopup }) => {
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
        <GrafanaPanel
            title={"Warning"}
            src={urls.warning}
            onLoad={() => handlePanelLoad("Warning")}
            hasViewButton={true} openPopup={openPopup}
          />
          {/* <GeneralPanel id_community={id_community}/> */}
          {/* <div></div> */}
        </div>
      </div>
      <div className="c2-general-container">
        <div className="b">
          <GrafanaPanel
            title={"AllClientsTable"}
            src={urls.table_cargador_url}
            onLoad={() => handlePanelLoad("AllClientsTable")}
            hasViewButton={true} openPopup={openPopup}
          />
        </div>
        <div className="c">
          <GrafanaPanel title={"Mapa"} src={urls.aviso_url} hasViewButton={true} openPopup={openPopup} />
        </div>
      </div>
    </div>
  );
};

export default Cargador;
