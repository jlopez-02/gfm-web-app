import React from "react";
import Arrows from "../AuxComponents/Arrows";
import Placa from "./../../assets/Placa.svg";
import Coche from "./../../assets/Coche.svg";
import Casas from "./../../assets/Casas.svg";
import Torre from "./../../assets/Torre.svg";

const GeneralPanel = (span = 5) => {
  const renderSpans = (span) => {
    const { count } = span;
    const spans = [];
    for (let i = 0; i < count; i++) {
      spans.push(<span></span>);
    }
    return spans;
  };

  return (
    <div className="GeneralPanel">
      <div className="container">
        <div className="top-left">
          <div className="box yellow">
            <img src={Placa} alt="" />
            <label>20kWh</label>
          </div>
        </div>
        <div className="top-right">
          <div className="box orange">
            <img src={Casas} alt="" />
            <label>20kWh</label>
          </div>
        </div>
        <div className="bottom-left">
          <div className="box red">
            <img src={Torre} alt="" />
            <label>20kWh</label>
          </div>
        </div>
        <div className="bottom-right">
          <div className="box orange">
            <img src={Coche} alt="" />
            <label>20kWh</label>
          </div>
        </div>

        {/* Arrows */}

        <div className="center-center">
          <div className="centered-box">
            <Arrows count={10} />
          </div>
        </div>
        <div className="top-center">
          <div className="centered-box">
            <Arrows count={10} degrees={-90} />
          </div>
        </div>
        <div className="bottom-center">
          <div className="centered-box">
            <Arrows count={10} degrees={-90} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPanel;
