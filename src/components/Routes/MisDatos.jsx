import React from "react";
import MisConsumosPanel from "../Panel/MisConsumosPanel";
import RepartoDiarioPanel from "../Panel/RepartoDiarioPanel";
import ResumenPanel from "../Panel/ResumenPanel";
import GrafanaPanel from "../GrafanaPanel/GrafanaPanel";
import generateGrafanaUrls from "./../../misc/grafana_urls";

const MisDatos = ({
  theme,
  id_community,
  type_consumer,
  logged_user,
  name_label,
  user_role,
  id,
}) => {
  const urls = generateGrafanaUrls(theme);
  console.log(user_role);
  console.log(id);
  console.log(type_consumer);
  
  
  
  return (
    <div className="mis-datos-container">
      <div className="mis-consumos-container">
        <div className="mis-consumos-panel-main">
          <MisConsumosPanel
            id_community={id_community}
            logged_user={logged_user}
            name_label={name_label}
            id={id}
            user_role={user_role}
            type_consumer={type_consumer}
          />
        </div>
      </div>
      <div className="rep-diario-container">
        <div>
          <ResumenPanel
            id_community={id_community}
            type_consumer={type_consumer}
            logged_user={logged_user}
            user_role={user_role}
            id={id}
          />
        </div>

        {/* <div className="panel-aux">
          <GrafanaPanel title={"Mapa"} src={urls.map_map_url} hasViewButton={true} openPopup={openPopup} />
        </div> */}
      </div>
    </div>
  );
};

export default MisDatos;
