import IP_ADDRESS from '../misc/config.js';

const generateGrafanaUrls = (theme, selectedId) => {
  const host_url = `http://${IP_ADDRESS}:3000/d-solo/b4861807-dfd2-426a-92fc-341254b8cc12`;
  const refresh_time = "1s";

  return {
    table_url: `${host_url}/02-generacion?orgId=1&theme=${theme}&panelId=9`,
    graph_url: `${host_url}/02-generacion?orgId=1&var-custom=mostrar&var-Instalacion=${selectedId}&theme=${theme}&panelId=10&refresh=1m`,
    total_generation: `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=11&refresh=${refresh_time}`,
    battery: `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=14&refresh=${refresh_time}`,
    production: `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=13&refresh=${refresh_time}`,
    power: `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=15&refresh=${refresh_time}`,
    ratio: `${host_url}/02-generacion-jle?orgId=1&theme=${theme}&panelId=16&refresh=${refresh_time}`,
  };
};

export default generateGrafanaUrls;
