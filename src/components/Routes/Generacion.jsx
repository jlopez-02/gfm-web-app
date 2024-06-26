import React, { useState, useEffect } from "react";
import useGeneracionData from "../../hooks/useGeneracionData";
import generateGrafanaUrls from "./../../misc/grafana_urls";
import Dropdown from "../Dropdown/Dropdown";
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";
import RangeCalendar from "../Calendar/RangeCalendar";

const Generacion = ({
  theme,
  loaded,
  delayedLoad,
  handleLoad,
  loadKey,
  id_community,
}) => {
  const { data, selectedId, setSelectedId } = useGeneracionData({
    id_community,
  });
  const [panelsLoaded, setPanelsLoaded] = useState({});

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
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

  const urls = generateGrafanaUrls(theme, selectedId, startDate, endDate, id_community);

  return (
    <div
      key={`generacion-${loadKey}`}
      className="generacion-container"
      style={{ display: delayedLoad ? "flex" : "none" }}
      onLoad={handleLoad}
    >
      <div className="c1-generacion-container">
        <div className="all-clients">
          <GrafanaPanel
            title={"AllClientsTable"}
            src={urls.gen_table_url}
            onLoad={() => handlePanelLoad("AllClientsTable")}
          />
        </div>
      </div>

      <div className="c2-generacion-container">
        <div className="selected-client">
          <div className="selected-client-container">
            <div className="selected-client-toolbar">
              <Dropdown
                label={"Cliente"}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                data={data}
              />
              <div className="timestamp-tool">
                <RangeCalendar startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>
              </div>
            </div>
            <GrafanaPanel
              title={"SelectedClient"}
              src={urls.gen_selected_client}
              onLoad={() => handlePanelLoad("SelectedClient")}
            />
          </div>
        </div>

        <div className="total-generation">
          <div className="total-generation-c1">
            <GrafanaPanel
              title={"TotalGeneration"}
              src={urls.gen_total_generation}
              onLoad={() => handlePanelLoad("TotalGeneration")}
            />
          </div>
          <div className="total-generation-c2">
            <GrafanaPanel
              title={"Bateria"}
              src={urls.gen_battery}
              onLoad={() => handlePanelLoad("Bateria")}
            />
            <GrafanaPanel
              title={"Produccion"}
              src={urls.gen_production}
              onLoad={() => handlePanelLoad("Produccion")}
            />
            <GrafanaPanel
              title={"Potencia"}
              src={urls.gen_power}
              onLoad={() => handlePanelLoad("Potencia")}
            />
            <GrafanaPanel
              title={"Ratio"}
              src={urls.gen_ratio}
              onLoad={() => handlePanelLoad("Ratio")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generacion;
