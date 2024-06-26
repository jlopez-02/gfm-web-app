import React from 'react';
import './Calendar.css'

const Calendar = ({label, value, onChange}) => {

  return (
    <div className='Calendar'>
        {label && <label className="custom-label">{label}</label>}
        <input type='datetime-local' value={value} onChange={onChange}/>
    </div>
  );
};

export default Calendar;
