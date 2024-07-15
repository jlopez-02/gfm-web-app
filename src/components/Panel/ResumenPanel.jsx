import React, { useEffect, useState } from "react";
import "./Panel.css";
import NumberTextField from "../Textfield/NumberTextfield";
import { fetchFloatDataFromDB, fetchStringDataFromDB } from "../../misc/fetch";
import RangeCalendar from "./../Calendar/RangeCalendar";
import useResumenData from "../../hooks/useResumenData";

const ResumenPanel = ({ id_community, type_consumer, logged_user }) => {
  const [precioDia, setPrecioDia] = useState(1);

  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayFormatted = dateToYYYYMMDDTHHMM(startOfToday);
  const nowFormatted = dateToYYYYMMDDTHHMM(today);
  const [startDate, setStartDate] = useState(startOfTodayFormatted);
  const [endDate, setEndDate] = useState(nowFormatted);

  const { bateriaCarga, bateriaDescarga } = useResumenData(id_community, startDate, endDate);
  

  if (bateriaCarga === null || bateriaDescarga === null) {
    return <div>Loading...</div>;
  }


  const bateria_carga = bateriaCarga ? bateriaCarga[0].carga : 0;
  const bateria_descarga = bateriaDescarga ? bateriaDescarga[0].descarga : 0;

  return (
    <div className="resumen-panel-container">
      <div className="resumen-panel-sub-container">
        <div className="summary-container">
          <h2 className="title">RESUMEN</h2>
          <div className="resumen-calendar">
            <RangeCalendar
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </div>
          
          {/* <div className="date-time">
            {date.toLocaleDateString()}{" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div> */}
          <div className="summary-item highlight">
            <span>ENERGÍA GENERADA</span>
            <span>{} kWh</span>
          </div>
          <div className="summary-item highlight">
            <span>ENERGÍA CONSUMIDA</span>
            <span>
              {parseFloat({}).toFixed(2)} kWh
            </span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA AUTOCONSUMIDA</span>
            <span>{} kWh</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA INYECTADA</span>
            <span>{} kWh</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA COMPRADA</span>
            <span>{} kWh</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA CARGA BATERÍA</span>
            <span>{Math.abs(parseFloat(bateria_carga)).toFixed(2)} kWh</span>
          </div>

          <div className="summary-item">
            <span>ENERGÍA DESCARGA BATERÍA</span>
            <span>{Math.abs(parseFloat(bateria_descarga)).toFixed(2)} kWh</span>
          </div>
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
              TOTAL AHORRADO HOY: {}€
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const dateToYYYYMMDDTHHMM = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default ResumenPanel;
