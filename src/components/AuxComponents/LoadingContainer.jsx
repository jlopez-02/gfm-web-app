import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

const LoadingContainer = () => {
  

  return (
    <div className="loading-div">
      <FontAwesomeIcon icon={faRotate} className="spinner-icon"/>
    </div>
  );
};

export default LoadingContainer;