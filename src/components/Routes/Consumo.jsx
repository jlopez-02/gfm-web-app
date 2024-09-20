import React, { useState, useEffect } from "react";
import useConsumoData from "../../hooks/useConsumoData";
import generateGrafanaUrls from "./../../misc/grafana_urls";
import Dropdown from "../Dropdown/Dropdown";
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";
import RangeCalendar from "../Calendar/RangeCalendar";

const Consumo = ({
  theme,
  loaded,
  delayedLoad,
  handleLoad,
  loadKey,
  id_community,
  openPopup,
  user_role
}) => {
  const { data, selectedId, setSelectedId } = useConsumoData({ id_community });
  const [panelsLoaded, setPanelsLoaded] = useState({});

  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTodayFormatted = dateToYYYYMMDDTHHMM(startOfToday);
  const nowFormatted = dateToYYYYMMDDTHHMM(today);

  const [startDate, setStartDate] = useState(startOfTodayFormatted);
  const [endDate, setEndDate] = useState(nowFormatted);

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

  const urls = generateGrafanaUrls(
    theme,
    selectedId,
    startDate,
    endDate,
    id_community
  );

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
            src={urls.cons_table_url}
            onLoad={() => handlePanelLoad("AllClientsTable")}
            hasViewButton={true}
            openPopup={openPopup}
            position="bottom"
          />
        </div>
      </div>

      <div className="c2-generacion-container">
        <div className="selected-client">
          <div className="selected-client-container">
            <div className="selected-client-toolbar">
              <Dropdown
                label={"Dispositivo"}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                data={data}
              />
              <div className="timestamp-tool">
                <RangeCalendar
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                />
              </div>
            </div>
            <div>
              <GrafanaPanel
                title={"SelectedClient"}
                src={selectedId === '985dad369259' ? urls.cons_selected_client_venus : selectedId === '1' ? urls.cons_selected_client_ingeteam : urls.cons_selected_client}
                onLoad={() => handlePanelLoad("SelectedClient")}
                hasViewButton={true}
                openPopup={openPopup}
              />
            </div>
          </div>
        </div>

        <div className="total-generation">
          <div className="total-generation-c1">
            <GrafanaPanel
              title={"TotalGeneration"}
              src={urls.cons_total_generation}
              onLoad={() => handlePanelLoad("TotalGeneration")}
              hasViewButton={true}
              openPopup={openPopup}
            />
          </div>
          <div className="total-generation-c2">
            <GrafanaPanel
              title={"Bateria"}
              src={urls.cons_battery}
              onLoad={() => handlePanelLoad("Bateria")}
            />
            <GrafanaPanel
              title={"Produccion"}
              src={urls.cons_production}
              onLoad={() => handlePanelLoad("Produccion")}
            />
            <GrafanaPanel
              title={"Cargador"}
              src={urls.cons_charger}
              onLoad={() => handlePanelLoad("Cargador")}
            />
            <GrafanaPanel
              title={"Ratio"}
              src={ user_role === "admin" ?  urls.cons_ratio : urls.cons_ratio_autoconsumo} 
              onLoad={() => handlePanelLoad("Ratio")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const dateToYYYYMMDDTHHMM = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default Consumo;
