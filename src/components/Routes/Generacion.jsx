import React, { useState } from "react";
import useGeneracionData from "../../hooks/useGeneracionData";
import generateGrafanaUrls from "./../../misc/grafana_urls";
import Dropdown from "../Dropdown/Dropdown";
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";
import Textfield from "../Textfield/Textfield";

const Generacion = ({ theme }) => {
  const [loaded, setLoaded] = useState(false);
  const { data, selectedId, setSelectedId } = useGeneracionData();

  const handleLoad = () => {
    setLoaded(true);
  };

  const urls = generateGrafanaUrls(theme, selectedId);

  return (
    <div
      className="generacion-container"
      style={{ display: loaded ? "flex" : "none" }}
      onLoad={handleLoad}
    >
      <div className="c1-generacion-container">
        <div className="all-clients">
          <GrafanaPanel title={"AllClientsTable"} src={urls.table_url} />
        </div>
      </div>

      <div className="c2-generacion-container">
        <div className="selected-client">
          <div className="selected-client-toolbar">
            <Dropdown
              label={"Cliente"}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              data={data}
            />
            <Textfield label={"Dias"} min={0} max={3650} />
            <Textfield label={"Horas"} min={0} max={24} />
          </div>
          <GrafanaPanel title={"SelectedClient"} src={urls.graph_url} />
        </div>

        <div className="total-generation">
          <div className="total-generation-c1">
            <GrafanaPanel
              title={"TotalGeneration"}
              src={urls.total_generation}
            />
          </div>
          <div className="total-generation-c2">
            <GrafanaPanel title={"Bateria"} src={urls.battery} />
            <GrafanaPanel title={"Produccion"} src={urls.production} />
            <GrafanaPanel title={"Potencia"} src={urls.power} />
            <GrafanaPanel title={"Ratio"} src={urls.ratio} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generacion;
