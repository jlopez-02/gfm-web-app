import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import "./Buttons.css";

const UpdateButton = ({ onClicked }) => {

  return (
    <div className="UpdateButton">
      <button className="custom-button" onClick={ onClicked }>
        <FontAwesomeIcon icon={faFilter} />
      </button>
    </div>
  );
};

export default UpdateButton;
