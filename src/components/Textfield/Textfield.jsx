import React, { useState } from 'react';
import "./Textfield.css";

const Textfield = ({ label="Label", min = 0, max=365 }) => {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
      let newValue = e.target.value;
      if (newValue === '') {
        setValue('');
        return;
      }
      if (newValue.match(/^[0-9]*$/)) {
        newValue = Math.max(min, Math.min(Number(newValue), max));
        setValue(newValue);
      }
    };

  return (
    <div className="Textfield">
      {label && <label className="custom-label">{label}</label>}
      <input
        type="number"
        className="custom-textfield"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default Textfield;
