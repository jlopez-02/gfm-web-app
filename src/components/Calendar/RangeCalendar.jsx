import React, { useState } from "react";
import Calendar from "./Calendar";
import UpdateButton from "../Buttons/UpdateButton";

const RangeCalendar = ({ startDate, setStartDate, endDate, setEndDate }) => {
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

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
        label="desde"
        value={tempStartDate}
        onChange={handleStartDateChange}
      />
      <Calendar
        label="hasta"
        value={tempEndDate}
        onChange={handleEndDateChange}
      />
      <UpdateButton onClicked={handleUpdate}>Update</UpdateButton>
    </>
  );
};

export default RangeCalendar;
