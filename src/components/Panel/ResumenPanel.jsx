import React, { useEffect, useState } from "react";
import "./Panel.css";
import NumberTextField from "../Textfield/NumberTextfield";
import RangeCalendar from "./../Calendar/RangeCalendar";
import useResumenData from "../../hooks/useResumenData";
import LoadingContainer from "../AuxComponents/LoadingContainer";

const ResumenPanel = ({ id_community, type_consumer, logged_user }) => {
  const [precioKWH, setPrecioKWH] = useState(localStorage.getItem("precioKWH") ? localStorage.getItem("precioKWH") : 1);

  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayFormatted = dateToYYYYMMDDTHHMM(startOfToday);
  const nowFormatted = dateToYYYYMMDDTHHMM(today);
  const [startDate, setStartDate] = useState(startOfTodayFormatted);
  const [endDate, setEndDate] = useState(nowFormatted);
  
  useEffect(() => {
    localStorage.setItem("precioKWH", precioKWH);
  }, [precioKWH]);

  const {isReady, energiaGenerada, energiaConsumida, bateriaCarga, bateriaDescarga } = useResumenData(id_community, startDate, endDate);
  
  

  if (!isReady || bateriaCarga === null || bateriaDescarga === null || energiaGenerada === null || energiaConsumida === null) {
    return <LoadingContainer/>;
  }
  

  const energia_generada = energiaGenerada ? energiaGenerada[0].generada : 0;
  const energia_consumida = energiaConsumida ? energiaConsumida : 0;
  const energia_autoconsumida = Math.min(energia_generada, energia_consumida);
  const energia_inyectada = energia_generada - energia_autoconsumida;
  const energia_comprada = energia_consumida - energia_autoconsumida;
  const bateria_carga = bateriaCarga ? bateriaCarga[0].carga : 0;
  const bateria_descarga = bateriaDescarga ? bateriaDescarga[0].descarga : 0; 

  console.log(energia_generada);
  

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
            <span>{isNaN(energia_generada) ? "Cargando..." : `${parseFloat(energia_generada).toFixed(2)} kWh`}</span>
          </div>
          <div className="summary-item highlight">
            <span>ENERGÍA CONSUMIDA</span>
            <span>
              {isNaN(energia_consumida) ? "Cargando..." : `${parseFloat(energia_consumida).toFixed(2)} kWh`}
            </span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA AUTOCONSUMIDA</span>
            <span>{isNaN(energia_autoconsumida) ? "Cargando..." : `${parseFloat(energia_autoconsumida).toFixed(2)} kWh`}</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA INYECTADA</span>
            <span>{isNaN(energia_inyectada) ? "Cargando..." : `${parseFloat(energia_inyectada).toFixed(2)} kWh`}</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA COMPRADA</span>
            <span>{isNaN(energia_comprada) ? "Cargando..." : `${parseFloat(energia_comprada).toFixed(2)} kWh`}</span>
          </div>
          <div className="summary-item">
            <span>ENERGÍA CARGA BATERÍA</span>
            <span>{isNaN(bateria_carga) ? "Cargando..." : `${parseFloat(Math.abs(bateria_carga)).toFixed(2)} kWh`}</span>
          </div>

          <div className="summary-item">
            <span>ENERGÍA DESCARGA BATERÍA</span>
            <span>{isNaN(bateria_descarga) ? "Cargando..." : `${parseFloat(Math.abs(bateria_descarga)).toFixed(2)} kWh`}</span>
          </div>
          <div className="summary-item">
            <NumberTextField
              label={"Coste diario"}
              min={0}
              max={3650}
              value={precioKWH}
              onChange={setPrecioKWH}
              outLabel="€/kWh"
            />
            <span className="total-saved">
              TOTAL AHORRADO: {parseFloat(precioKWH * energia_autoconsumida).toFixed(2)}€
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
