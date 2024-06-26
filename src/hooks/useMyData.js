import { useState, useEffect } from "react";
import IP_ADDRESS from "../misc/config";

const fetchDataFromDB = async (query, defaultValue, key) => {
  const url = `http://${IP_ADDRESS}:8086/query?db=${
    query.db
  }&q=${encodeURIComponent(query.query)}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(":"),
      },
    });
    const data = await response.json();
    if (data.results[0]?.series) {
      return data.results[0].series[0].values.map((item) => ({
        [key]: parseFloat(item[1]).toFixed(2),
      }));
    } else {
      return defaultValue;
    }
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return defaultValue;
  }
};

const useMyData = (id_community) => {
  const defaultValue = 0;
  const [consumption, setConsumption] = useState(defaultValue);
  const [production, setProduction] = useState(defaultValue);
  const [totalEnergy, setTotalEnergy] = useState(defaultValue);
  const [countUsers, setCountUsers] = useState(defaultValue);
  const [potenciaGeneracion, setPotenciaGenecion] = useState(defaultValue);

  // Función para obtener y actualizar la producción de energía
  const fetchAndSetProduction = async () => {
    const prodQuery = {
      db: "venus",
      query: `
        select sum(ultimo) from (
          select last(diferencia) as ultimo 
          from (
            select max(value) - min(value) as diferencia 
            from venus 
            where ID_COMMUNITY='${id_community}' 
              and subtopic =~ /.*Ac\\/Energy\\/Forward/ 
              and subtopic =~ /pvinverter.*/ 
              and time > now() - 1d 
            group by instanceNumber, time(1d)
          ) 
          group by instanceNumber
        )
      `,
    };
    const productionData = await fetchDataFromDB(
      prodQuery,
      defaultValue,
      "produccion"
    );
    setProduction(productionData);
  };

  // Función para obtener y actualizar el consumo de energía
  const fetchAndSetConsumption = async () => {
    const consQuery = {
      db: "shelly",
      query: `
        select last(v1)/1000 from (
          select max(total_act) - min(total_act) as v1 
          from shelly 
          where ID_COMMUNITY = '${id_community}' 
            and time >= now() - 1d 
          group by ID_DEVICE, time(1d)
        )
      `,
    };
    const consumptionData = await fetchDataFromDB(
      consQuery,
      defaultValue,
      "consumo"
    );
    setConsumption(consumptionData);
  };

  // Función para obtener y actualizar la energía total
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
    const totalEnergyData = await fetchDataFromDB(
      totalEnergyQuery,
      defaultValue,
      "total_energy"
    );
    setTotalEnergy(totalEnergyData);
  };

  const fetchCommunitySameTypeUsers = async () => {
    const countUsersQuery = {
      db: "user_info",
      query: `
        select count(ID) from user_info where ID_COMMUNITY = '${id_community}' and type_CONSUMER = 'residencial'
      `,
    };
    const countUsersData = await fetchDataFromDB(
      countUsersQuery,
      defaultValue,
      "count_users"
    );
    setCountUsers(countUsersData);
  };

  const fetchPotenciaGeneracion = async () => {
    const pGenQuery = {
      db: "venus",
      query: `
        select last(v1) from (select mean(value) as v1 from venus where subtopic=~ /system\\/0\\/Ac\\/PvOnGrid\\/.*\\/Power/ AND ID_COMMUNITY='${id_community}' group by subtopic, ID_BUILDING, time(1m) fill(linear)) group by time(1m) order by desc limit 1
      `,
    };
    const pGenData = await fetchDataFromDB(
      pGenQuery,
      defaultValue,
      "potencia_generacion"
    );
    setPotenciaGenecion(pGenData);
  };

  // Función para obtener y actualizar todos los datos
  const fetchData = async () => {
    await fetchAndSetConsumption();
    await fetchAndSetProduction();
    await fetchAndSetTotalEnergy();
    await fetchCommunitySameTypeUsers();
    await fetchPotenciaGeneracion();
  };

  useEffect(() => {
    // Inicialmente obtener los datos
    fetchData();

    // Configurar el intervalo para obtener los datos cada 10 segundos
    const interval = setInterval(fetchData, 10000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return { consumption, production, totalEnergy, countUsers, potenciaGenerada: potenciaGeneracion };
};

export default useMyData;
