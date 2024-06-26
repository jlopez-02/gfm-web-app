import { useState, useEffect } from "react";
import IP_ADDRESS from "../misc/config";

const fetchDataFromDB = async (query, defaultValue, key) => {
  const url = `http://${IP_ADDRESS}:8086/query?db=${query.db}&q=${encodeURIComponent(query.query)}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(":"),
      },
    });
    const data = await response.json();
    if (data.results[0]?.series) {
      return data.results[0].series[0].values.map((item) => ({
        [key]: parseFloat(item[1]).toFixed(2),
      }));
    } else {
      return defaultValue;
    }
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return defaultValue;
  }
};

const useGeneralData = (id_community) => {
  const defaultValue = 0;
  const [totalEnergy, setTotalEnergy] = useState(defaultValue);
  const [energy, setEnergy] = useState(defaultValue);
  
  const fetchAndSetTotalEnergy = async () => {
    const totalEnergyQuery = {
      db: "venus",
      query: `
        select sum(v1) from (
          select max(value) - min(value) as v1 
          from venus 
          where subtopic =~ /.*Ac\\/Energy\\/Forward/ 
            and subtopic =~ /pvinverter.*/ 
            and time > now() - 1d 
            and ID_COMMUNITY ='${id_community}' 
          group by instanceNumber, time(1d)
        ) 
        group by time(1d) 
        order by desc 
        limit 1
      `,
    };
    const totalEnergyData = await fetchDataFromDB(totalEnergyQuery, defaultValue, "total_energy");
    setTotalEnergy(totalEnergyData);
  };

  const fetchEnergy = async () => {
    const energyQuery = {
      db: "shelly",
      query: `
        SELECT sum(v1) from (SELECT max(total_act)-min(total_act) as v1 FROM shelly where time >= now()-1d and ID_COMMUNITY='${id_community}' group by ID_DEVICE)
      `,
    };
    const energyData = await fetchDataFromDB(energyQuery, defaultValue, "energy");
    setEnergy(energyData);
  };
  
  const fetchData = async () => {
    await fetchAndSetTotalEnergy();
    await fetchEnergy();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return { totalEnergy, energy };
};

export default useGeneralData;
