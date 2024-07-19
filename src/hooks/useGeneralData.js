import { useState, useEffect } from "react";
import IP_ADDRESS from "../misc/config";
import { fetchFloatDataFromDB } from "../misc/fetch";

const useGeneralData = (id_community) => {
  const defaultValue = 0;
  const [totalEnergy, setTotalEnergy] = useState(defaultValue);
  const [consumoTotalComunidad, setConsumoTotalComunidad] =
    useState(defaultValue);
  const [cargador, setCargador] = useState(defaultValue);
  const [energia_inyectada, setEnergiaInyectada] = useState(defaultValue);
  const [bateriaCarga, setBateriaCarga] = useState(defaultValue);
  const [isReady, setIsReady] = useState(false);

  const checkIfReady = () => {
    if (
      !isNaN(totalEnergy) &&
      !isNaN(consumoTotalComunidad) &&
      !isNaN(cargador) &&
      !isNaN(bateriaCarga)
    ) {
      setIsReady(true);
    }
  };

  const fetchAndSetTotalEnergy = async () => {
    const totalEnergyQuery = {
      db: "venus",
      query: `
        select sum(v1)/1000 from (select last(value) as v1 from venus where subtopic=~ /pvinverter\\/.*\\/Ac\\/Power/ and ID_COMMUNITY ='${id_community}' group by subtopic) group by ID_BUILDING order by desc limit 1
      `,
    };
    const totalEnergyData = await fetchFloatDataFromDB(
      totalEnergyQuery,
      defaultValue,
      "total_energy"
    );
    setTotalEnergy(totalEnergyData);
  };

  const fetchConsumoTotalComunidad = async () => {
    const consQuery1 = {
      db: "shelly",
      query: `
        select sum(v1)/1000 from (SELECT mean(total_act_power) as v1 FROM shelly WHERE ID_COMMUNITY='${id_community}' group by ID_DEVICE, time(1m)) group by time(1m) fill(0) order by desc limit 1
      `,
    };
    const consQuery2 = {
      db: "venus",
      query: `
        select sum(v3)/1000 from (select mean(value) as v3 from venus where subtopic=~ /system\\/0\\/Ac\\/Consumption\\/.*\\/Power/ and ID_COMMUNITY='${id_community}' group by subtopic, ID_BUILDING, time(1m)) group by ID_BUILDING, time(1m) fill(0) order by desc limit 1`,
    };
    const consumptionData1 = await fetchFloatDataFromDB(
      consQuery1,
      defaultValue,
      "consumo1"
    );
    const consumptionData2 = await fetchFloatDataFromDB(
      consQuery2,
      defaultValue,
      "consumo2"
    );
    setConsumoTotalComunidad(
      parseFloat(consumptionData1[0].consumo1) +
        parseFloat(consumptionData2[0].consumo2)
    );
  };

  const fetchCargador = async () => {
    const cargadorQuery = {
      db: "ingeteam",
      query: `
        select sum(energy) as v6 from charger where state=9 and time>now()-7d group by time(1d) fill(0) order by desc limit 1
      `,
    };
    const cargadorData = await fetchFloatDataFromDB(
      cargadorQuery,
      defaultValue,
      "cargador"
    );
    setCargador(cargadorData);
  };

  const fetchInyectada = async () => {
    const injectQuery = {
      db: "venus",
      query: `
        select sum(v1)/1000 as energia_autoconsumida from (select mean(value) as v1 from venus where subtopic=~ /system\\/0\\/Ac\\/Consumption\\/.*\\/Power/ and ID_COMMUNITY='${id_community}' and time>now()-1d group by subtopic, ID_BUILDING, time(1h)) group by time(1d) order by desc limit 1
      `,
    };
    const injectData = await fetchFloatDataFromDB(
      injectQuery,
      defaultValue,
      "energia_inyectada"
    );
    setEnergiaInyectada(injectData);
  };

  const fetchBateriaCarga = async () => {
    const cargaQuery = {
      db: "venus",
      query: `
        select sum(v3)/1000 from (select mean(value) as v3 from venus where subtopic=~ /system\\/0\\/Dc\\/Battery\\/Power/ and ID_COMMUNITY='${id_community}' group by subtopic, ID_BUILDING, time(1m)) group by ID_BUILDING, time(1m) fill(previous) order by desc limit 1`,
    };
    const cargaData = await fetchFloatDataFromDB(
      cargaQuery,
      defaultValue,
      "carga"
    );
    setBateriaCarga(cargaData);
  };

  const fetchData = async () => {
    await fetchAndSetTotalEnergy();
    await fetchConsumoTotalComunidad();
    await fetchCargador();
    //await fetchInyectada();
    await fetchBateriaCarga();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkIfReady();
  }, [totalEnergy, consumoTotalComunidad]);

  return {
    isReady,
    totalEnergy,
    consumoTotalComunidad,
    cargador,
    //energia_inyectada,
    bateriaCarga,
  };
};

export default useGeneralData;
