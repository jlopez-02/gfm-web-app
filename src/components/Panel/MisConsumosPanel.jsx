import React, { useState, useEffect } from "react";
import GFM3 from "../../assets/GFM3.png";
import "./Panel.css";
import Arrows from "../AuxComponents/Arrows";
import { fetchFloatDataFromDB, fetchStringDataFromDB } from "../../misc/fetch";
import { Tooltip } from "react-tooltip";

const MisConsumosPanel = ({ id_community, logged_user }) => {
  const defaultValue = 0;
  const [id_device, setIdDevice] = useState(0);
  const [id_building, setIdBuilding] = useState(0);
  const [production, setProduction] = useState(defaultValue);
  const [consumption, setConsumption] = useState(defaultValue);

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
        select ID from user_info where name_USER = '${logged_user}' and type_ID = 'shelly' order by asc limit 1 
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

  const fetchAndSetProduction = async () => {
    if (id_building !== 0) {
      const prodQuery = {
        db: "venus",
        query: `
          SELECT sum(v1) from (select max(value) - min(value) as v1 from venus where subtopic =~ /.*Ac\\/Energy\\/Forward/ and subtopic =~ /pvinverter.*/ and time > now() - 1d and ID_BUILDING='${id_building}' and ID_COMMUNITY = '${id_community}' group by instanceNumber, time(1d)) group by time(1d) order by desc limit 1
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

  const fetchAndSetConsumption = async () => {
    if (id_device !== 0) {
      const consQuery = {
        db: "shelly",
        query: `
        SELECT max(total_act)/1000-min(total_act)/1000 FROM shelly where time >= now()-1d and ID_COMMUNITY='${id_community}' and ID_DEVICE='${id_device}' group by time(1d) order by desc limit 1
      `,
      };
      const consumptionData = await fetchFloatDataFromDB(
        consQuery,
        defaultValue,
        "consumo"
      );
      setConsumption(consumptionData);
    }
  };

  const fetchData = async () => {
    await fetchIdVenus();
    await fetchIdDevice();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (id_building !== 0 || id_device !== 0) {
      fetchAndSetConsumption(id_device);
      fetchAndSetProduction(id_building);

      const interval = setInterval(() => {
        fetchAndSetConsumption(id_device);
        fetchAndSetProduction(id_building);
      }, 10000);

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [id_building, id_device]);

  if (consumption === null || production === null || id_building === null) {
    return <div>Loading...</div>;
  }

  const consumo = consumption ? consumption[0].consumo : 0;
  const produccion = production ? production[0].produccion : 0;
  const diferencia = (parseFloat(consumo) - parseFloat(produccion)).toFixed(2);

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
          {parseFloat(consumo).toFixed(2)} kWh
        </div>
        <Tooltip id="Consumida USUARIO" />
        <div
          className="info-box info-solar"
          data-tooltip-id="Generada USUARIO"
          data-tooltip-content="Generada USUARIO"
          data-tooltip-place="bottom"
        >
          {parseFloat(produccion).toFixed(2)} kWh
        </div>
        <Tooltip id="Generada USUARIO" />
        <div
          className={diferencia <= 0 ? "info-box info-grid amarillo" : "info-box info-grid rojo" }
          data-tooltip-id="Inyectada USUARIO"
          data-tooltip-content="Inyectada USUARIO"
          data-tooltip-place="bottom"
        >
          {diferencia} kWh{" "}
        </div>
        <Tooltip id="Inyectada USUARIO" />
      </div>
    </div>
  );
};

export default MisConsumosPanel;
