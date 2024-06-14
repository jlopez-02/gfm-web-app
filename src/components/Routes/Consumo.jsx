import React, { useState, useEffect } from "react";
import useGeneracionData from "../../hooks/useGeneracionData";
import generateGrafanaUrls from "./../../misc/grafana_urls";
import Dropdown from "../Dropdown/Dropdown";
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";
import Textfield from "../Textfield/Textfield";
import UpdateButton from "../Buttons/UpdateButton";

const Consumo = ({ theme, loaded, delayedLoad, handleLoad, loadKey }) => {
  const { data, selectedId, setSelectedId } = useGeneracionData();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(3);
  const [totalHours, setTotalHours] = useState(hours);
  const [panelsLoaded, setPanelsLoaded] = useState({});

  const handleButtonClick = () => {
    const daysValue = days ? parseInt(days) : 0;
    const hoursValue = hours ? parseInt(hours) : 0;
    const totalHours = daysValue * 24 + hoursValue;
    setTotalHours(totalHours);
  };

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

  const urls = generateGrafanaUrls(theme, selectedId, totalHours);

  return (
    <div
      key={`consumo-${loadKey}`}
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
          <div className="selected-client-toolbar">
            <Dropdown
              label={"Cliente"}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              data={data}
            />
            <div className="timestamp-tool">
              <Textfield
                label={"Dias"}
                min={0}
                max={3650}
                value={days}
                onChange={setDays}
              />
              <Textfield
                label={"Horas"}
                min={0}
                max={24}
                value={hours}
                onChange={setHours}
              />
              <UpdateButton onClicked={handleButtonClick} />
            </div>
          </div>
          <GrafanaPanel title={"SelectedClient"} src={urls.gen_selected_client} onLoad={() => handlePanelLoad("SelectedClient")}/>
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
            <GrafanaPanel title={"Bateria"} src={urls.gen_battery} onLoad={() => handlePanelLoad("Bateria")}/>
            <GrafanaPanel title={"Produccion"} src={urls.gen_production} onLoad={() => handlePanelLoad("Produccion")}/>
            <GrafanaPanel title={"Potencia"} src={urls.gen_power} onLoad={() => handlePanelLoad("Potencia")}/>
            <GrafanaPanel title={"Ratio"} src={urls.gen_ratio} onLoad={() => handlePanelLoad("Ratio")}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consumo;
