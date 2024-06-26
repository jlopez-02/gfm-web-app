import IP_ADDRESS from '../misc/config.js';

const generateGrafanaUrls = (theme, selectedId, startDate, endDate, id_community) => {

  const startDate_ts = new Date(startDate).getTime();
  const endDate_ts = new Date(endDate).getTime();

  const timestamp = `from=${startDate_ts}&to=${endDate_ts}`;

  const host_url = `http://${IP_ADDRESS}:3000`;
  const map_url = `${host_url}/d-solo/GFM_01_MAPA/01-mapa?orgId=1&var-ID_COMMUNITY=${id_community}`;
  const gen_url = `${host_url}/d-solo/GFM_02_GENERACION/02-generacion?orgId=1&var-ID_COMMUNITY=${id_community}`;
  const cons_url = `${host_url}/d-solo/GFM_03_CONSUMO/03-consumo?orgId=1&var-ID_COMMUNITY=${id_community}`;
  
  //http://localhost:3000/d/adlviuoq74e80f/03-consumo?orgId=1&viewPanel=9
  
  const refresh_time = "1s";

  const gen_update_graphs_properties = `var-ID_BUILDING=${selectedId}&${timestamp}`;
  const cons_update_graphs_properties = `var-ID_DEVICE=${selectedId}&${timestamp}`;
  const properties = `theme=${theme}&refresh=${refresh_time}`;

  return {
    //URL MAPA
    map_map_url: `${map_url}&panelId=12&theme=${theme}&refresh=1m`,
    //URL GENERACION
    gen_table_url: `${gen_url}&panelId=9&${properties}`,
    gen_selected_client: `${gen_url}&panelId=10&${gen_update_graphs_properties}&${properties}`,
    gen_total_generation: `${gen_url}&panelId=11&${timestamp}&${properties}`,
    gen_battery: `${gen_url}&panelId=14&${properties}`,
    gen_production: `${gen_url}&panelId=13&${properties}`,
    gen_power: `${gen_url}&panelId=15&${properties}`,
    gen_ratio: `${gen_url}&panelId=16&${properties}`,
    //URL CONSUMO
    cons_table_url: `${cons_url}&panelId=9&${properties}`,
    cons_selected_client: `${cons_url}&panelId=10&${cons_update_graphs_properties}&${properties}`,
    cons_total_generation: `${cons_url}&panelId=11&${timestamp}&${properties}`,
    cons_battery: `${cons_url}&panelId=14&${properties}`,
    cons_production: `${cons_url}&panelId=13&${properties}}`,
    cons_power: `${cons_url}&panelId=15&${properties}`,
    cons_ratio: `${cons_url}&panelId=16&${properties}`,
  };
};

export default generateGrafanaUrls;
