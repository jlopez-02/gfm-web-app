import React from "react";
import './Popup.css'; 
const Popup = ({ url, onClose }) => {
    return (
      <div className="popup">
        <div className="popup-content">
          <button className="close-btn" onClick={onClose}>X</button>
          <iframe src={url} title="Popup Iframe" className="popup-iframe"></iframe>
        </div>
      </div>
    );
  };

export default Popup;
