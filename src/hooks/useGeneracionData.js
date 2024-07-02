import { useState, useEffect } from "react";
import IP_ADDRESS from "../misc/config";

const useGeneracionData = ({ id_community }) => {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState();
  useEffect(() => {
    const query = `select ID from user_info Where type_ID = 'venus' and ID_COMMUNITY = '${id_community}'`;
    const url = `http://${IP_ADDRESS}:8086/query?db=user_info&q=${encodeURIComponent(
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
        if (data.results[0]?.series) {
          const formattedData = data.results[0]?.series[0]?.values.map(
            (item) => ({
              id: item[1],
            })
          );
          setData(formattedData);

          if (formattedData.length > 0) {
            setSelectedId(formattedData[0].id);
          }
        }
      })
      .catch((error) => console.error("Error querying InfluxDB:", error));
  }, []);

  return { data, selectedId, setSelectedId };
};

export default useGeneracionData;
