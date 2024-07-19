import React, { useState, useEffect } from "react";
import GFM3 from "../../assets/GFM3.png";
import "./Panel.css";
import { fetchFloatDataFromDB, fetchStringDataFromDB } from "../../misc/fetch";
import { Tooltip } from "react-tooltip";
import LoadingContainer from "../AuxComponents/LoadingContainer";

const MisConsumosPanel = ({ id_community, logged_user }) => {
  const defaultValue = 0;
  const [id_device, setIdDevice] = useState(0);
  const [id_building, setIdBuilding] = useState(0);
  const [production, setProduction] = useState(defaultValue);
  const [consumption, setConsumption] = useState(defaultValue);
  const [battery, setBattery] = useState(defaultValue);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const fetchIdVenus = async () => {
    const idVenusQuery = {
      db: "user_info",
      query: `
        select ID from user_info where name_USER = '${logged_user}' and type_ID = 'venus' order by desc limit 1 
      `,
    };
    const idVenusData = await fetchStringDataFromDB(
      idVenusQuery,
      defaultValue,
      "id_building"
    );
    if (idVenusData.length > 0) {
      setIdBuilding(idVenusData[0].id_building);
    }
  };

  const fetchIdDevice = async () => {
    const idDeviceQuery = {
      db: "user_info",
      query: `
        select ID from user_info where name_USER = '${logged_user}' and type_ID = 'shelly' order by desc limit 1 
      `,
    };
    const idDeviceData = await fetchStringDataFromDB(
      idDeviceQuery,
      defaultValue,
      "id_device"
    );
    if (idDeviceData.length > 0) {
      setIdDevice(idDeviceData[0].id_device);
    }
  };

  const fetchAndSetBattery = async () => {
    if (id_community !== 0) {
      const batteryQuery = {
        db: "venus",
        query: `
          select sum(v3)/1000 from (select mean(value) as v3 from venus where subtopic=~ /system\\/0\\/Dc\\/Battery\\/Power/ and ID_COMMUNITY='${id_community}' group by subtopic, ID_BUILDING, time(1m)) group by ID_BUILDING, time(1m) fill(previous) order by desc limit 1
 `,
      };
      const batteryData = await fetchFloatDataFromDB(
        batteryQuery,
        defaultValue,
        "battery"
      );
      setBattery(batteryData);
    }
  };

  const fetchAndSetConsumption = async () => {
    if (id_community !== 0) {
      const consQuery1 = {
        db: "shelly",
        query: `
        select sum(v1)/1000 from (SELECT mean(total_act_power) as v1 FROM shelly WHERE ID_COMMUNITY='${id_community}' group by ID_DEVICE, time(1m)) group by time(1m) fill(0) order by desc limit 1
      `,
      };
      const consQuery2 = {
        db: "venus",
        query: `
          select sum(v3)/1000 from (select mean(value) as v3 from venus where subtopic=~ /system\\/0\\/Ac\\/Consumption\\/.*\\/Power/ and ID_COMMUNITY='${id_community}' group by subtopic, ID_BUILDING, time(1m)) group by ID_BUILDING, time(1m) fill(0) order by desc limit 1

        `,
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
      setConsumption(
        parseFloat(consumptionData1[0].consumo1) +
          parseFloat(consumptionData2[0].consumo2)
      );
    }
  };

  const fetchAndSetProduction = async () => {
    if (id_community !== 0) {
      const prodQuery = {
        db: "venus",
        query: `
        select sum(v1)/1000 from (select last(value) as v1 from venus where subtopic=~ /pvinverter\\/.*\\/Ac\\/Power/ and ID_COMMUNITY ='${id_community}' group by subtopic) group by ID_BUILDING order by desc limit 1
          `,
      };
      const productionData = await fetchFloatDataFromDB(
        prodQuery,
        defaultValue,
        "produccion"
      );
      setProduction(productionData);
    }
  };

  const checkIfReady = () => {
    if (!isNaN(production) && !isNaN(consumption) && !isNaN(battery)) {
      setIsReady(true);
    }
  };

  const fetchData = async () => {
    //await fetchIdVenus();
    //await fetchIdDevice();
    setIsDataLoaded(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (id_community !== 0) {
      fetchAndSetProduction(id_community);
      fetchAndSetConsumption(id_community);
      fetchAndSetBattery(id_community);

      const interval = setInterval(() => {
        fetchAndSetProduction(id_community);
        fetchAndSetConsumption(id_community);
        fetchAndSetBattery(id_community);
      }, 10000);

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [id_building]);

  useEffect(() => {
    checkIfReady();
  }, [production, consumption]);

  if (
    !isReady ||
    consumption === null ||
    production === null ||
    id_building === null ||
    battery === null
  ) {
    return <LoadingContainer />;
  }

  const consumo = consumption ? consumption : 0;
  const produccion = production ? production[0].produccion : 0;
  const bateria = battery ? battery[0].battery : 0;
  const diferencia = (-parseFloat(produccion) + parseFloat(consumo) + parseFloat(bateria)).toFixed(2);

  return (
    <div className="mis-consumos-panel-container">
      <div className="mis-consumos-panel-sub-container">
        <img src={GFM3} alt="Interfaz Solar" />
        <div
          className="info-box info-house"
          data-tooltip-id="Consumida USUARIO"
          data-tooltip-content="Consumida USUARIO"
          data-tooltip-place="left"
        >
          {isNaN(consumo) ? "Cargando..." : `${parseFloat(consumo).toFixed(2)} kW`}
        </div>
        <Tooltip id="Consumida USUARIO" />
        <div
          className="info-box info-solar"
          data-tooltip-id="Generada USUARIO"
          data-tooltip-content="Generada USUARIO"
          data-tooltip-place="bottom"
        >
          {isNaN(produccion) ? "Cargando..." : `${parseFloat(produccion).toFixed(2)} kW`}
        </div>
        <Tooltip id="Generada USUARIO" />
        <div
          className={
            diferencia <= 0
              ? "info-box info-grid amarillo"
              : "info-box info-grid rojo"
          }
          data-tooltip-id="Inyectada USUARIO"
          data-tooltip-content="Inyectada USUARIO"
          data-tooltip-place="bottom"
        >
          {isNaN(diferencia) ? "Cargando..." : `${parseFloat(diferencia).toFixed(2)} kW`}
        </div>
        <Tooltip id="Inyectada USUARIO" />

        <div
          className="info-box info-battery"
          data-tooltip-id="Bateria USUARIO"
          data-tooltip-content="Bateria USUARIO"
          data-tooltip-place="bottom"
        >
          {isNaN(bateria) ? "Cargando..." : `${parseFloat(bateria).toFixed(2)} kW`}
        </div>
        <Tooltip id="Bateria USUARIO" />
      </div>
    </div>
  );
};

export default MisConsumosPanel;
