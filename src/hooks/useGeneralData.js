import { useState, useEffect } from "react";
import IP_ADDRESS from "../misc/config";

const fetchDataFromDB = async (query, defaultValue, key) => {
  const url = `http://${IP_ADDRESS}:8086/query?db=${query.db}&q=${encodeURIComponent(query.query)}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(":"),
      },
    });
    const data = await response.json();

    if (data.results[0]?.series) {
      return data.results[0].series[0].values.map((item) => {
        const value = item[1];
        return {
          [key]: value !== null && !isNaN(value) ? parseFloat(value).toFixed(2) : defaultValue,
        };
      });
    } else {
      return defaultValue;
    }
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return defaultValue;
  }
};

const useGeneralData = (id_community) => {
  const defaultValue = 0;
  const [totalEnergy, setTotalEnergy] = useState(defaultValue);
  const [consumoTotalComunidad, setConsumoTotalComunidad] = useState(defaultValue);
  const [cargador, setCargador] = useState(defaultValue);
  const [energia_inyectada, setEnergiaInyectada] = useState(defaultValue);
  
  const fetchAndSetTotalEnergy = async () => {
    const totalEnergyQuery = {
      db: "venus",
      query: `
        select sum(v1) from (
          select max(value) - min(value) as v1 
          from venus 
          where subtopic =~ /.*Ac\\/Energy\\/Forward/ 
            and subtopic =~ /pvinverter.*/ 
            and time > now() - 1d 
            and ID_COMMUNITY ='${id_community}' 
          group by instanceNumber, time(1d)
        ) 
        group by time(1d) 
        order by desc 
        limit 1
      `,
    };
    const totalEnergyData = await fetchDataFromDB(totalEnergyQuery, defaultValue, "total_energy");
    setTotalEnergy(totalEnergyData);
  };

  const fetchConsumoTotalComunidad = async () => {
    const consumoTotalComunidadQuery = {
      db: "shelly",
      query: `
        select sum(v1)/1000 as energia_consumida_instalaciones from (SELECT max(total_act)-min(total_act) as v1 FROM shelly where time >= now()-1d and ID_COMMUNITY='${id_community}' group by ID_DEVICE, time(1d)) group by time(1d) order by desc limit 1
      `,
    };
    const consumoTotalComunidadData = await fetchDataFromDB(consumoTotalComunidadQuery, defaultValue, "cons");
    setConsumoTotalComunidad(consumoTotalComunidadData);
  };

  const fetchCargador = async () => {
    const cargadorQuery = {
      db: "ingeteam",
      query: `
        select sum(v1) from (SELECT max(energy)-min(energy) as v1 FROM charger where time >= now()-1d and ID_COMMUNITY='${id_community}' GROUP BY ID_POINT, time(1d)) group by time(1d) order by desc limit 1
      `,
    };
    const cargadorData = await fetchDataFromDB(cargadorQuery, defaultValue, "cargador");
    setCargador(cargadorData);
  };

  const fetchInyectada = async () => {
    const injectQuery = {
      db: "venus",
      query: `
        select sum(v1)/1000 as energia_autoconsumida from (select mean(value) as v1 from venus where subtopic=~ /system\\/0\\/Ac\\/Consumption\\/.*\\/Power/ and ID_COMMUNITY='${id_community}' and time>now()-1d group by subtopic, ID_BUILDING, time(1h)) group by time(1d) order by desc limit 1
      `,
    };
    const injectData = await fetchDataFromDB(injectQuery, defaultValue, "energia_inyectada");
    setEnergiaInyectada(injectData);
  };
  
  const fetchData = async () => {
    await fetchAndSetTotalEnergy();
    await fetchConsumoTotalComunidad();
    await fetchCargador();
    await fetchInyectada();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return { totalEnergy, consumoTotalComunidad, cargador, energia_inyectada };
};

export default useGeneralData;
