import React, { useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";

const Generacion = ({ theme }) => {
  const [selectedId, setSelectedId] = useState("985dad369259");

  const host_url = "http://localhost:3000/d-solo/b4861807-dfd2-426a-92fc-341254b8cc12";
  const refresh_time = "1s";

  let table_url = `${host_url}/02-generacion?orgId=1&theme=${theme}&panelId=9`;
  let graph_url = `${host_url}/02-generacion?orgId=1&var-custom=mostrar&var-portalId=${selectedId}&theme=${theme}&panelId=10&refresh=1m`;

  let total_generation = `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=11&refresh=${refresh_time}`;
  let battery = `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=14&refresh=${refresh_time}`;
  let production = `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=13&refresh=${refresh_time}`;
  let power = `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=15&refresh=${refresh_time}`;
  let ratio = `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=16&refresh=${refresh_time}`;

  return (
    <div className="generacion-container">
      <div className="c1-generacion-container">
        <div className="all-clients">
          <GrafanaPanel title={"AllClientsTable"} src={table_url}/>
        </div>
      </div>

      <div className="c2-generacion-container">
        <div className="selected-client">
          <Dropdown selectedId={selectedId} setSelectedId={setSelectedId} />
          <GrafanaPanel title={"SelectedClient"} src={graph_url} />
        </div>

        <div className="total-generation">
          <div className="total-generation-c1">
            <GrafanaPanel title={"TotalGeneration"} src={total_generation}/>
          </div>
          <div className="total-generation-c2">
            <GrafanaPanel title={"Bateria"} src={battery}/>
            <GrafanaPanel title={"Produccion"} src={production}/>
            <GrafanaPanel title={"Potencia"} src={power}/>
            <GrafanaPanel title={"Ratio"} src={ratio}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generacion;
