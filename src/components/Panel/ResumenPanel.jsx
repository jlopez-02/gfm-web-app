import React, { useEffect, useState } from "react";
import "./Panel.css";
import NumberTextField from "../Textfield/NumberTextfield";
import { fetchFloatDataFromDB, fetchStringDataFromDB } from "../../misc/fetch";

const ResumenPanel = ({ id_community, type_consumer, logged_user }) => {
  const [precioDia, setPrecioDia] = useState(1);
  const [date, setDate] = useState(new Date());

  const defaultValue = 0;

  const [id_device, setIdDevice] = useState(0);

  const [consumption, setConsumption] = useState(defaultValue);
  const [totalEnergy, setTotalEnergy] = useState(defaultValue);
  const [countUsers, setCountUsers] = useState(defaultValue);

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
    const totalEnergyData = await fetchFloatDataFromDB(
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
        select count(ID) from user_info where ID_COMMUNITY = '${id_community}' and type_CONSUMER = '${type_consumer}'
      `,
    };
    const countUsersData = await fetchFloatDataFromDB(
      countUsersQuery,
      defaultValue,
      "count_users"
    );
    setCountUsers(countUsersData);
  };

  const fetchData = async () => {
    await fetchIdDevice();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (id_community !== 0 || id_device !== 0) {
      fetchAndSetConsumption(id_device);
      fetchAndSetTotalEnergy();
      fetchCommunitySameTypeUsers();

      const interval = setInterval(() => {
        fetchAndSetConsumption(id_device);
        fetchAndSetTotalEnergy();
        fetchCommunitySameTypeUsers();
      }, 10000);

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [id_device]);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  if (totalEnergy === null || countUsers === null || consumption === null) {
    return <div>Loading...</div>;
  }

  const consumo_total = consumption ? consumption[0].consumo : 0;

  const total_energy = totalEnergy ? totalEnergy[0].total_energy : 0;
  const count_Users = countUsers ? countUsers[0].count_users : 0;

  let energia_consumida_comunidad = 0;

  if (type_consumer === "industrial") {
    energia_consumida_comunidad = (total_energy * 0.6) / count_Users;
  } else {
    energia_consumida_comunidad = (total_energy * 0.4) / count_Users;
  }

  let energia_consumida_red = 0;

  if (energia_consumida_comunidad >= consumo_total) {
    energia_consumida_comunidad = consumo_total;
    energia_consumida_red = 0;
  } else {
    energia_consumida_red = parseFloat(
      consumo_total - energia_consumida_comunidad
    ).toFixed(2);
  }

  let ratio_autoconsumo = energia_consumida_comunidad
    ? parseFloat((energia_consumida_comunidad / consumo_total) * 100).toFixed(2)
    : parseInt(0).toFixed(2);

  let total_ahorrado = parseFloat(
    precioDia * energia_consumida_comunidad
  ).toFixed(2);

  return (
    <div className="resumen-panel-container">
      <div className="resumen-panel-sub-container">
        <div className="summary-container">
          <h2 className="title">RESUMEN</h2>
          <div className="date-time">
            {date.toLocaleDateString()}{" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="summary-item highlight">
            <span>ENERGÍA CONSUMIDA TOTAL</span>
            <span>{parseFloat(consumo_total).toFixed(2)} kWh</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA CONSUMIDA DESDE LA RED</span>
            <span>{energia_consumida_red} kWh</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA CONSUMIDA DE LA COMUNIDAD</span>
            <span>
              {parseFloat(energia_consumida_comunidad).toFixed(2)} kWh
            </span>
          </div>
          <div className="summary-item highlight">
            <span>RATIO DE AUTOCONSUMO</span>
            <span>{ratio_autoconsumo}%</span>
          </div>
          <div className="summary-item"></div>
          <div className="summary-item">
            <NumberTextField
              label={"Coste diario"}
              min={0}
              max={3650}
              value={precioDia}
              onChange={setPrecioDia}
              outLabel="€/kWh"
            />
            <span className="total-saved">
              TOTAL AHORRADO HOY: {total_ahorrado}€
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenPanel;
