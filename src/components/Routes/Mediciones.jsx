import React from "react";
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";
import generateGrafanaUrls from "./../../misc/grafana_urls";

const Mediciones = (selectedId) => {
  const urls = generateGrafanaUrls((selectedId = "985dad369259"));

  return (
    <div>
      <iframe
        src="http://localhost:3000/d-solo/b4861807-dfd2-426a-92fc-341254b8cc12/02-generacion?orgId=1&panelId=10"
        width="1000"
        height="500"
        frameborder="0"
      ></iframe>
    </div>
  );
};

export default Mediciones;
