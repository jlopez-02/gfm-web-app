import React, { useState, useEffect, useRef } from "react";
import "./Dropdown.css";

const LoginDropdown = ({ selectedItem, setSelectedItem, data, label, admin = false, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (item) => {
    setSelectedItem(item); // Almacenamos tanto id como label
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const fnClick = (item) => {

    if(admin){
      onChange();
    }
    handleClickOutside(item);
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="Dropdown">
      {label && <label className="custom-label">{label}</label>}
      <div ref={selectRef} className="custom-select-container">
        <div
          className={`custom-select ${isOpen ? "select-arrow-active" : ""}`}
          onClick={handleSelectClick}
        >
          <div className="select-selected">
            {selectedItem?.label || "Selecciona uno"} {/* Mostramos el label */}
          </div>
          <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
            {data.length < 1 ? (
              <div>No Data</div>
            ) : (
              data.map((item, index) => (
                <div key={index} onClick={() => handleOptionClick(item)}>
                  {item.label} {/* Mostramos el label en las opciones */}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDropdown;
