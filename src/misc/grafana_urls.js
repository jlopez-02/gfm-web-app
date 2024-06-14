import IP_ADDRESS from '../misc/config.js';

const generateGrafanaUrls = (theme, selectedId, totalHours) => {

  
  const host_url = `http://${IP_ADDRESS}:3000`;
  const map_url = `${host_url}/d-solo/d2738894-e9df-45d6-91f7-11e78e5ec939`;
  const gen_url = `${host_url}/d-solo/b4861807-dfd2-426a-92fc-341254b8cc12`;
  const cons_url = `${host_url}/d/adlviuoq74e80f`;
  
  //http://localhost:3000/d/adlviuoq74e80f/03-consumo?orgId=1&viewPanel=9
  const refresh_time = "1s";

  return {
    //URL MAPA
    map_map_url: `${map_url}/01-mapa?orgId=1&refresh=1m&theme=${theme}&panelId=12`,
    //URL GENERACION
    gen_table_url: `${gen_url}/02-generacion?orgId=1&theme=${theme}&panelId=9&refresh=${refresh_time}`,
    gen_selected_client: `${gen_url}/02-generacion?orgId=1&var-custom=mostrar&var-Instalacion=${selectedId}&theme=${theme}&panelId=10&refresh=${refresh_time}&from=now-${totalHours}h&to=now`,
    gen_total_generation: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=11&refresh=${refresh_time}&from=now-${totalHours}h&to=now`,
    gen_battery: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=14&refresh=${refresh_time}`,
    gen_production: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=13&refresh=${refresh_time}`,
    gen_power: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=15&refresh=${refresh_time}`,
    gen_ratio: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=16&refresh=${refresh_time}`,
    //URL CONSUMO
    cons_table_url: `${gen_url}/02-generacion?orgId=1&theme=${theme}&panelId=9&refresh=${refresh_time}`,
    cons_selected_client: `${gen_url}/02-generacion?orgId=1&var-custom=mostrar&var-Instalacion=${selectedId}&theme=${theme}&panelId=10&refresh=${refresh_time}&from=now-${totalHours}h&to=now`,
    cons_total_generation: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=11&refresh=${refresh_time}&from=now-${totalHours}h&to=now`,
    cons_battery: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=14&refresh=${refresh_time}`,
    cons_production: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=13&refresh=${refresh_time}`,
    cons_power: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=15&refresh=${refresh_time}`,
    cons_ratio: `${gen_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=16&refresh=${refresh_time}`,
  };
};

export default generateGrafanaUrls;
