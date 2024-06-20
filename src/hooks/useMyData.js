import { useState, useEffect } from "react";
import IP_ADDRESS from "../misc/config";

const useMyData = () => {
  const [consumption, setConsumption] = useState(null);
  const [production, setProduction] = useState(null);

  // Función para obtener la diferencia de energía
  const fetchProduccion = async () => {
    const prodQuery = `
      select sum(ultimo) from (select last(diferencia) as ultimo from (select max(value) - min(value) as diferencia from venus00 where subtopic =~ /.*Ac\\/Energy\\/Forward/ and subtopic =~ /pvinverter.*/ and time > now() - 1d group by instanceNumber, time(1d)) group by instanceNumber)
    `;
    const prodUrl = `http://${IP_ADDRESS}:8086/query?db=venus&q=${encodeURIComponent(
      prodQuery
    )}`;

    try {
      const response = await fetch(prodUrl, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(":"),
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching difference:", error);
    }
  };

  // Función para obtener la energía
  const fetchConsumo = async () => {
    const consQuery = `
      select last(Energia) from (
        select max(total_act) - min(total_act) as "Energia" 
        from shelly_devices 
        where time >= now() - 1d 
        group by device_id, time(1d)
      )
    `;
    const consUrl = `http://${IP_ADDRESS}:8086/query?db=shelly&q=${encodeURIComponent(
      consQuery
    )}`;

    try {
      const response = await fetch(consUrl, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(":"),
        },
      });
      const data = await response.json();
      if (data.results[0]?.series) {
        const formattedData = data.results[0].series[0].values.map((item) => ({
          consumo: parseFloat(item[1]).toFixed(2),
        }));
        setConsumption(formattedData);
      } else {
        console.log("No series data available");
        setConsumption([]);
      }
    } catch (error) {
      console.error("Error fetching energy:", error);
    }
  };

  const fetchData = async () => {
    await fetchConsumo();
    const productionData = await fetchProduccion();
    if (productionData?.results[0]?.series) {
      const formattedData = productionData.results[0].series[0].values.map(
        (item) => ({
          produccion: parseFloat(item[1]).toFixed(2),
        })
      );
      setProduction(formattedData);
    }
  };

  useEffect(() => {
    // Inicialmente obtener los datos
    fetchData();

    // Configurar el intervalo para obtener los datos cada 10 segundos
    const interval = setInterval(fetchData, 10000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return { consumption, production };
};

export default useMyData;
