import { useState, useEffect } from "react";
import IP_ADDRESS from '../misc/config';

const useGeneracionData = () => {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState("985dad369259");

  useEffect(() => {
    const query = `show tag values from venus02 with key=portalId`;
    const url = `http://${IP_ADDRESS}:8086/query?db=venus&q=${encodeURIComponent(query)}`;

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
            id: item[1],
          })
        );
        setData(formattedData);
      })
      .catch((error) => console.error("Error querying InfluxDB:", error));
  }, []);

  return { data, selectedId, setSelectedId};
};

export default useGeneracionData;