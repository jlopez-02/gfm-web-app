import IP_ADDRESS from '../misc/config.js';

const generateGrafanaUrls = (theme, selectedId, startDate, endDate, id_community) => {

  const startDate_ts = new Date(startDate).getTime();
  const endDate_ts = new Date(endDate).getTime();

  const timestamp = `from=${startDate_ts}&to=${endDate_ts}`;

  const host_url = `http://${IP_ADDRESS}:3000`;
  const map_url = `${host_url}/d-solo/GFM_01_MAPA/01-mapa?orgId=1&var-ID_COMMUNITY=${id_community}`;
  const gen_url = `${host_url}/d-solo/GFM_02_GENERACION/02-generacion?orgId=1&var-ID_COMMUNITY=${id_community}`;
  const cons_url = `${host_url}/d-solo/GFM_03_CONSUMO/03-consumo?orgId=1&var-ID_COMMUNITY=${id_community}`;
  const general_url = `${host_url}/d-solo/GFM_04_TABLAS/04-tablas?orgId=1`;
  
  //http://localhost:3000/d/adlviuoq74e80f/03-consumo?orgId=1&viewPanel=9
  
  const refresh_time = "10s";

  const gen_update_graphs_properties = `var-ID_BUILDING=${selectedId}&${timestamp}`;
  const cons_update_graphs_properties = `var-ID_DEVICE=${selectedId}&${timestamp}`;
  const properties = `theme=${theme}&refresh=${refresh_time}`;

  return {
    //URL MAPA
    map_map_url: `${map_url}&panelId=12&theme=${theme}`,
    //URL GENERACION
    gen_table_url: `${gen_url}&panelId=9&${properties}`,
    gen_selected_client: `${gen_url}&panelId=10&${gen_update_graphs_properties}&${properties}`,
    gen_total_generation: `${gen_url}&panelId=11&${timestamp}&${properties}`,
    gen_battery: `${gen_url}&panelId=14&${properties}`,
    gen_production: `${gen_url}&panelId=13&${properties}`,
    gen_power: `${gen_url}&panelId=15&${properties}`,
    gen_ratio: `${gen_url}&panelId=19&${properties}`,
    gen_ratio_autoconsumo: `${gen_url}&panelId=20&${properties}`,
    //URL CONSUMO
    cons_table_url: `${cons_url}&panelId=9&${properties}`,
    cons_selected_client: `${cons_url}&panelId=10&${cons_update_graphs_properties}&${properties}`,
    cons_selected_client_venus: `${cons_url}&panelId=18&${cons_update_graphs_properties}&${properties}`,
    cons_selected_client_ingeteam: `${cons_url}&panelId=19&${cons_update_graphs_properties}&${properties}`,
    cons_total_generation: `${cons_url}&panelId=11&${timestamp}&${properties}`,
    cons_battery: `${cons_url}&panelId=14&${properties}`,
    cons_production: `${cons_url}&panelId=13&${properties}}`,
    cons_ratio: `${cons_url}&panelId=21&${properties}`,
    cons_ratio_autoconsumo: `${cons_url}&panelId=22&${properties}`,
    cons_charger: `${cons_url}&panelId=16&${properties}`,
    //URL GENERAL
    general_url: `${general_url}&panelId=1&${properties}`,
    //URL CARGADOR
    table_cargador_url: `${general_url}&panelId=3&${properties}`,
    aviso_url: `${general_url}&panelId=4&${properties}`,
    warning: `${general_url}&panelId=6&${properties}`
  };
};

export default generateGrafanaUrls;
