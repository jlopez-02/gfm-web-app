import React, { useState } from "react";
import Calendar from "./Calendar";
import UpdateButton from "../Buttons/UpdateButton";

const RangeCalendar = ({ startDate, setStartDate, endDate, setEndDate }) => {
  const [tempStartDate, setTempStartDate] = useState(dateToDDMMYYYY(startDate));
  const [tempEndDate, setTempEndDate] = useState(dateToDDMMYYYY(endDate));

  const handleUpdate = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    if (!tempEndDate || value <= tempEndDate) {
      setTempStartDate(value);
    }
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (!tempStartDate || value >= tempStartDate) {
      setTempEndDate(value);
    }
  };
  

  return (
    <>
      <Calendar
        label="Desde"
        value={tempStartDate}
        onChange={handleStartDateChange}
      />
      <Calendar
        label="Hasta"
        value={tempEndDate}
        onChange={handleEndDateChange}
      />
      <UpdateButton onClicked={handleUpdate}>Update</UpdateButton>
    </>
  );
};

const dateToDDMMYYYY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default RangeCalendar;
