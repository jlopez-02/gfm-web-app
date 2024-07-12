import React, { useState } from "react";
import './GrafanaPanel.css';

const GrafanaPanel = ({ src, title, hasViewButton = false, openPopup, position = 'top', findVenus = false }) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleExpandClick = () => {
    openPopup(src);
  };

  const buttonStyle = {
    [position]: '10px'
  };
  

  return (
    <div className="Grafana-panel">
      <iframe
        title={title}
        src={src}
        frameBorder="0"
        onLoad={handleLoad}
        style={{ display: loaded ? "block" : "none" }}
      ></iframe>
      {loaded && hasViewButton && (
        <button className="expand-btn" style={buttonStyle} onClick={handleExpandClick}>
          Expandir
        </button>
      )}
    </div>
  );
};

export default GrafanaPanel;
