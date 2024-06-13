import React from 'react';
import "./Textfield.css";

const Textfield = ({ label="Label", min = 0, max=365, value, defaulValue, onChange}) => {

  const handleChange = (e) => {
    let newValue = e.target.value;
    if (newValue === '' || newValue < min) {
        newValue = min;
        onChange(newValue);
        return;
    }
    if (newValue.match(/^[0-9]*$/)) {
        newValue = Math.max(min, Math.min(Number(newValue), max));
        onChange(newValue);
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
