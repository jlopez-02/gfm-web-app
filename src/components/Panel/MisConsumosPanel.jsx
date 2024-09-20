import React, { useState, useEffect } from "react";
import GFM_09_InyDesc from "../../assets/GFM_09_InyDesc.png";
import GFM_09_InyCarga from "../../assets/GFM_09_InyCarga.png";
import GFM_09_AbsCarga from "../../assets/GFM_09_AbsCarga.png";
import GFM_09_AbsDesc from "../../assets/GFM_09_AbsDesc.png";
import GFM_09_Cargador from "../../assets/Cargador.png";
import GFM_09_Vivienda from "../../assets/GFM_09Vivienda.png";
import "./Panel.css";
import { fetchFloatDataFromDB, fetchStringDataFromDB } from "../../misc/fetch";
import { Tooltip } from "react-tooltip";
import LoadingContainer from "../AuxComponents/LoadingContainer";

const MisConsumosPanel = ({
  id_community,
  logged_user,
  id,
  user_role,
  type_consumer,
  name_label,
}) => {
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

  const isAdminVenus = user_role === "admin" ? "" : `and ID_BUILDING='${id}'`;
  const isAdminShelly = user_role === "admin" ? "" : `and ID_DEVICE='${id}'`;

  const fetchAndSetBattery = async () => {
    if (id_community !== 0) {
      const batteryQuery = {
        db: "venus",
        query: `
          select last(value)/1000 from venus where subtopic=~ /system\\/0\\/Dc\\/Battery\\/Power/ and ID_COMMUNITY='${id_community}' 
          ${isAdminVenus}
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
        select sum(v1)/1000 from (SELECT mean(total_act_power) as v1 FROM shelly WHERE ID_COMMUNITY='${id_community}' ${isAdminShelly} group by ID_DEVICE, time(1m)) group by time(1m) fill(0) order by desc limit 1
      `,
      };
      const consQuery2 = {
        db: "venus",
        query: `
          select last(v3)/1000 as v3, ID_BUILDING as ID_DEVICE from (select sum(v3) as v3 from (select mean(value) as v3 from venus where subtopic=~ /system\\/0\\/Ac\\/Consumption\\/.*\\/Power/ and ID_COMMUNITY='${id_community}'
          ${isAdminVenus} group by subtopic, ID_BUILDING, time(1m)) group by ID_BUILDING, time(1m) fill(previous))
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

      let c1 = consumptionData1[0]
        ? parseFloat(consumptionData1[0].consumo1)
        : 0;
      let c2 = consumptionData2[0]
        ? parseFloat(consumptionData2[0].consumo2)
        : 0;
      setConsumption(c1 + c2);
      // console.log(c1);
      // console.log(c2);
    }
  };

  const fetchAndSetProduction = async () => {
    if (id_community !== 0) {
      const prodQuery = {
        db: "venus",
        query: `
          select last(v2)/1000 from (select sum(v1) as v2 from (select mean(value) as v1 from venus where subtopic=~ /pvinverter\\/.*\\/Ac\\/Power/ and ID_COMMUNITY ='${id_community}' ${isAdminVenus} and time>now()-1m group by subtopic, time(10s)) group by time(10s))
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
  const diferencia = (
    -parseFloat(produccion) +
    parseFloat(consumo) +
    parseFloat(bateria)
  ).toFixed(2);




  const autarquia = (parseFloat(produccion) - parseFloat(bateria) + (diferencia < 0 ? parseFloat(diferencia) : 0)) / parseFloat(consumo) * 100;
    

  let img = GFM_09_InyCarga;

  const isCargador = type_consumer === "cargador";
  const isResidencial = type_consumer === "residencial";

  if (isCargador) {
    img = GFM_09_Cargador;
  } else if (isResidencial) {
    img = GFM_09_Vivienda;
  } else {
    img =
      diferencia <= 0
        ? bateria <= 0
          ? GFM_09_InyDesc
          : GFM_09_InyCarga
        : bateria <= 0
        ? GFM_09_AbsDesc
        : GFM_09_AbsCarga;
  }

  return (
    <div className="mis-consumos-panel-container">
      <div className="mis-consumos-panel-sub-container">
        <img src={img} alt="Interfaz Solar" />
        {(isCargador || isResidencial) && (
          <div className="user-tag">
            <label>Usuario</label>
            <h2 id="croquis-username">{name_label}</h2>
          </div>
        )}
        <div className="r-autarquia">
          <label>Autarquía</label>
          <label>=</label>
          <label id="croquis-username">
            {isNaN(autarquia) || !isFinite(autarquia) || type_consumer === "residencial"
              ? "0.00%"
              : `${parseFloat(autarquia).toFixed(2)} %`}
          </label>
        </div>

        <div
          className="info-box info-house"
          data-tooltip-id="Consumida USUARIO"
          data-tooltip-content="Consumida USUARIO"
          data-tooltip-place="left"
        >
          {isNaN(consumo)
            ? ".........."
            : `${parseFloat(consumo).toFixed(2)} kW`}
        </div>
        <Tooltip id="Consumida USUARIO" />

        {!isCargador && !isResidencial && (
          <>
            <div
              className="info-box info-solar"
              data-tooltip-id="Generada USUARIO"
              data-tooltip-content="Generada USUARIO"
              data-tooltip-place="bottom"
            >
              {isNaN(produccion)
                ? ".........."
                : `${parseFloat(produccion).toFixed(2)} kW`}
            </div>
            <div className="info-box-secondary info-solar-f1">
              <label>
                Instalada: <b>63.5 kW</b>
              </label>
              <label>
                Pico: <b>60.8 kWp</b>
              </label>
            </div>
            <Tooltip id="Generada USUARIO" />

            <label
              className="info-box-secondary info-grid-label"
              data-text={diferencia <= 0 ? "inyectando..." : "absorbiendo..."}
            ></label>
            <div
              className={
                "info-box info-grid"
              }
              data-tooltip-id="Inyectada USUARIO"
              data-tooltip-content="Inyectada USUARIO"
              data-tooltip-place="bottom"
            >
              {isNaN(diferencia)
                ? ".........."
                : `${Math.abs(parseFloat(diferencia).toFixed(2))} kW`}
            </div>
            <Tooltip id="Inyectada USUARIO" />
            <label
              className="info-box-secondary info-battery-label"
              data-text={bateria <= 0 ? "descargando..." : "cargando..."}
            ></label>
            <div
              className="info-box info-battery"
              data-tooltip-id="Bateria USUARIO"
              data-tooltip-content="Bateria USUARIO"
              data-tooltip-place="bottom"
            >
              {isNaN(bateria)
                ? ".........."
                : `${Math.abs(parseFloat(bateria).toFixed(2))} kW`}
            </div>
            <div className="info-box-secondary info-battery-f1">
              <label>
                Batería: <b>15 kW</b>
              </label>
              <label>
                Capacidad de batería: <b>45 kWh</b>
              </label>
            </div>
            <Tooltip id="Bateria USUARIO" />
          </>
        )}
      </div>
    </div>
  );
};

export default MisConsumosPanel;
