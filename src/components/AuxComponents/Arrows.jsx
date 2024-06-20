import React from "react";

const styles = {
  span: {
    display: "block",
    width: "1.5vw",
    height: "1.5vw",
    borderBottom: "5px solid black",
    borderRight: "5px solid black",
    transform: "rotate(45deg)",
    margin: "-10px",
    animation: "animate 3s infinite",
  },
};

const Arrows = ({ count, degrees = 180 }) => {
  const maxDelay = 0.2; // Tiempo máximo de delay en segundos
  const totalAnimationDuration = maxDelay * (count - 1); // Duración total de la animación
  const spans = [];
  for (let i = count - 1; i >= 0; i--) {
    const animationDelay = `${maxDelay * (count - i - 1)}s`;
    const spanStyle = {
      ...styles.span,
      animation: `animate ${totalAnimationDuration}s linear infinite`,
      animationDelay,
    };
    spans.push(<span key={i} style={spanStyle}></span>);
  }

  return (
    <div className="centered-box">
      <div className="arrow" style={{ transform: `rotate(${degrees}deg)` }}>
        {spans}
      </div>
    </div>
  );
};

export default Arrows;
