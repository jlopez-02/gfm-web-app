import { useState, useEffect } from "react";
import { fetchFloatDataFromDB} from "../misc/fetch";

const useGeneralData = (id_community, startDate, endDate, user_role, id) => {
  const defaultValue = 0;
  
  const [isReady, setIsReady] = useState(false);

  const [energiaGenerada, setEnergiaGenerada] = useState(defaultValue);
  const [energiaConsumida, setEnergiaConsumida] = useState(defaultValue);
  const [bateriaDescarga, setBateriaDescarga] = useState(defaultValue);
  const [bateriaCarga, setBateriaCarga] = useState(defaultValue);

  const startDate_ts = new Date(startDate).getTime();
  const endDate_ts = new Date(endDate).getTime();

  const checkIfReady = () => {
    if (
      !isNaN(energiaGenerada) &&
      !isNaN(energiaConsumida) &&
      !isNaN(bateriaCarga) &&
      !isNaN(bateriaDescarga)
    ) {
      setIsReady(true);
    }
  };
  const isAdminVenus = user_role === "admin" ? "" : `and ID_BUILDING='${id}'`; 
  const isAdminShelly = user_role === "admin" ? "" : `and ID_DEVICE='${id}'`;
 
  const fetchGenerada = async () => {
    const query = {
      db: "venus",
      query: `
        select sum(v1)/1000 as produccion_total from (select mean(value) 
        as v1 from venus where subtopic=~ /pvinverter\\/.*\\/Ac\\/Power/ 
        and ID_COMMUNITY='${id_community}' ${isAdminVenus} and time > ${startDate_ts}ms and time < ${endDate_ts}ms group by instanceNumber, time(1h)) 
      `,
    };
    const data = await fetchFloatDataFromDB(query, defaultValue, "generada");
    setEnergiaGenerada(data);
  };

  const fetchConsumida = async () => {
    const query1 = {
      db: "shelly",
      query: `
        select sum(v1)/1000 as v1_shelly from (SELECT max(total_act)-min(total_act) as v1 FROM shelly 
        where time >= now()-1d and ID_COMMUNITY='${id_community}' ${isAdminShelly} and time > ${startDate_ts}ms and time < ${endDate_ts}ms group by ID_DEVICE, time(1d))

      `,
    };
    const query2 = {
      db: "venus",
      query: `
        select sum(v1)/1000 from (select mean(value) as v1 from venus where subtopic=~ /system\\/0\\/Ac\\/Consumption\\/.*\\/Power/ 
        and ID_COMMUNITY='${id_community}' ${isAdminVenus} and time > ${startDate_ts}ms and time < ${endDate_ts}ms group by time(1h), subtopic)
      `,
    };
    const query3 = {
      db: "venus",
      query: `
        select sum(v1)/1000 from (select mean(value) 
        as v1 from venus where subtopic=~ /system\\/0\\/Dc\\/Battery\\/Power/ 
        and ID_COMMUNITY='${id_community}' ${isAdminVenus} and time > ${startDate_ts}ms and time < ${endDate_ts}ms group by time(1h)) 
      `,
    };
    const query4 = {
      db: "ingeteam",
      query: `
        select sum(energy) as v1_ingeteam from charger where state=9 and time > ${startDate_ts}ms and time < ${endDate_ts}ms group by time(1d) fill(0)  
      `,
    };

    const data1 = await fetchFloatDataFromDB(query1, defaultValue, "consumida");
    const data2 = await fetchFloatDataFromDB(query2, defaultValue, "consumida");
    const data3 = await fetchFloatDataFromDB(query3, defaultValue, "consumida");
    const data4 = await fetchFloatDataFromDB(query4, defaultValue, "consumida");

    let d1 = data1[0] ?  parseFloat(data1[0].consumida) : 0;
    let d2 = data2[0] ?  parseFloat(data2[0].consumida) : 0;
    let d3 = data3[0] ?  parseFloat(data3[0].consumida) : 0;
    let d4 = data4[0] ?  parseFloat(data4[0].consumida) : 0;

    //console.log(d1 + " | " + d2 + " | " + d3 +  " | " + d4);
    setEnergiaConsumida(d1 + d2 + d3 + d4);
  };

  const fetchBateriaCarga = async () => {
    const cargaQuery = {
      db: "venus",
      query: `
        select sum(v1)*1/60/1000 from (select mean(value) as v1 from venus where value>0 and 
        subtopic='system/0/Dc/Battery/Power' and ID_COMMUNITY='${id_community}' ${isAdminVenus}
        and time > ${startDate_ts}ms and time < ${endDate_ts}ms group by time(1m) fill(0))  
      `,
    };
    const cargaData = await fetchFloatDataFromDB(cargaQuery, defaultValue, "carga");
    
    setBateriaCarga(cargaData);
  };

  const fetchBateriaDescarga = async () => {
    const descargaQuery = {
      db: "venus",
      query: `
        select sum(v1)*1/60/1000 from (select mean(value) as v1 from venus where value<0 and 
        subtopic='system/0/Dc/Battery/Power' and ID_COMMUNITY='${id_community}' ${isAdminVenus}
        and time > ${startDate_ts}ms and time < ${endDate_ts}ms group by time(1m) fill(0))
      `,
    };
    const descargaData = await fetchFloatDataFromDB(descargaQuery, defaultValue, "descarga");
    setBateriaDescarga(descargaData);
  };
  
  const fetchData = async () => {
    await fetchBateriaCarga();
    await fetchBateriaDescarga();
    await fetchGenerada();
    await fetchConsumida();
  };

  useEffect(() => {
    setInterval(() => {
      checkIfReady();
    }, 2000)
  }, [energiaGenerada, energiaConsumida, bateriaCarga, bateriaDescarga]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return { isReady, energiaGenerada, energiaConsumida, bateriaCarga, bateriaDescarga };
};

export default useGeneralData;
