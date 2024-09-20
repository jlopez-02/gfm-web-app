import { useState, useEffect } from "react";
import IP_ADDRESS from "../misc/config";

const useLoginData = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    const query = `select ID, name_label from user_info`;
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
              label: item[2],
            })
          );
          setData(formattedData);

          if (formattedData.length > 0) {
            setSelectedItem(formattedData[0]);
          } 
        }
      })
      .catch((error) => console.error("Error querying InfluxDB:", error));
  }, []);

  return { data, selectedItem, setSelectedItem };
};

export default useLoginData;
