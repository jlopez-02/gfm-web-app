import { useState, useEffect } from "react";
import IP_ADDRESS from "../misc/config";
import { fetchFloatDataFromDB} from "../misc/fetch";

const useGeneralData = (id_community, startDate, endDate) => {
  const defaultValue = 0;
  
  const [energiaGenerada, setEnergiaGenerada] = useState(defaultValue);
  const [bateriaDescarga, setBateriaDescarga] = useState(defaultValue);
  const [bateriaCarga, setBateriaCarga] = useState(defaultValue);

  const startDate_ts = new Date(startDate).getTime();
  const endDate_ts = new Date(endDate).getTime();

  const fetchBateriaCarga = async () => {
    const cargaQuery = {
      db: "venus",
      query: `
        select sum(v1) from (select sum(v1)/1000 as v1 from (select mean(value) as v1 from venus where value<0 and subtopic='system/0/Dc/Battery/Power' and ID_COMMUNITY='${id_community}' and time > ${startDate_ts}ms and time < ${endDate_ts}ms group by time(1h)) group by time(1d))   
      `,
    };
    const cargaData = await fetchFloatDataFromDB(cargaQuery, defaultValue, "carga");
    setBateriaCarga(cargaData);
  };

  const fetchBateriaDescarga = async () => {
    const descargaQuery = {
      db: "venus",
      query: `
        select sum(v1) from (select sum(v1)/1000 as v1 from (select mean(value) as v1 from venus where value>0 and subtopic='system/0/Dc/Battery/Power' and ID_COMMUNITY='${id_community}' and time > ${startDate_ts}ms and time < ${endDate_ts}ms group by time(1h)) group by time(1d))   
      `,
    };
    const descargaData = await fetchFloatDataFromDB(descargaQuery, defaultValue, "descarga");
    setBateriaDescarga(descargaData);
  };
  
  const fetchData = async () => {
    await fetchBateriaCarga();
    await fetchBateriaDescarga();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return { bateriaCarga, bateriaDescarga };
};

export default useGeneralData;
