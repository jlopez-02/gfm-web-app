import React, { useState, useEffect } from "react";
import IP_ADDRESS from '../../misc/config.js'; 
import "./Dropdown.css";

const Dropdown = ({ selectedId,setSelectedId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const query = `show tag values from venus02 with key=portalId`;
    const url = `http://${IP_ADDRESS}:8086/query?db=venus&q=${encodeURIComponent(
      query
    )}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(":"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.results[0]?.series[0]?.values.map(
          (item) => ({
            portalId: item[1],
          })
        );
        setData(formattedData);
      })
      .catch((error) => console.error("Error querying InfluxDB:", error));
  }, []);

  return (
    <div className="dropdown-generacion-container">
      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        {data.map((item, index) => (
          <option key={index} value={item.portalId}>
            {item.portalId}
          </option>
        ))}
      </select>
    </div>
  );
};


export default Dropdown;