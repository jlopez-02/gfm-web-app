import React, { useState, useEffect, useRef } from "react";
//import IP_ADDRESS from '../../misc/config.js';
import "./Dropdown.css";

const Dropdown = ({ selectedId, setSelectedId, data, customContent, label, queryField }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value) => {
    setSelectedId(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const defaultContent = (
    <>
      {data.map((item, index) => (
        <div key={index} onClick={() => handleOptionClick(item.id)}>
          {item.id}
        </div>
      ))}
    </>
  );

  const dias = (
    <>
      <div onClick={() => handleOptionClick("Opcion 1")}>Opcion 1</div>
      <div onClick={() => handleOptionClick("Opcion 2")}>Opcion 2</div>
    </>
  )

  const content = customContent ? dias : defaultContent;

  return (
    <div className="Dropdown">
      {label && <label className="custom-label">{label}</label>}
      <div ref={selectRef} className="custom-select-container">
        <div
          className={`custom-select ${isOpen ? "select-arrow-active" : ""}`}
          onClick={handleSelectClick}
        >
          <div className="select-selected">
            {selectedId || "Selecciona una opción"}
          </div>
          <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
            {data.length < 1 ? <div>No Data</div> : content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
