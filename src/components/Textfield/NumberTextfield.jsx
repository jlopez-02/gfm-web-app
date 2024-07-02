import React from "react";
import "./Textfield.css";

const NumberTextfield = ({ label = "Label", outLabel = "", min = 0, max = 365, value, onChange }) => {

  const handleChange = (e) => {
    let newValue = e.target.value;

    // Permitir que el campo esté vacío
    if (newValue === '') {
      onChange('');
      return;
    }

    // Remover ceros iniciales a menos que el valor sea "0." para permitir decimales como "0.1"
    if (newValue.match(/^0[0-9]+/)) {
      newValue = newValue.replace(/^0+/, '');
    }

    // Permitir solo números decimales positivos
    if (newValue.match(/^\d*\.?\d*$/)) {
      const numericValue = parseFloat(newValue);

      // Asegurar que el valor esté dentro del rango min y max
      if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
        onChange(newValue);
      }
    }
  };

  return (
    <div className="Textfield">
      {label && <label className="custom-label">{label}</label>}
      <input
        type="text"
        className="custom-textfield"
        value={value}
        onChange={handleChange}
      />
      {outLabel && <label className="custom-outlabel">{outLabel}</label>}
    </div>
  );
};

export default NumberTextfield;

