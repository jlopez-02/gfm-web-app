import IP_ADDRESS from "./config";
const fetchFloatDataFromDB = async (query, defaultValue, key) => {
  const url = `http://${IP_ADDRESS}:8086/query?db=${
    query.db
  }&q=${encodeURIComponent(query.query)}`;
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

const fetchStringDataFromDB = async (query, defaultValue, key) => {
    const url = `http://${IP_ADDRESS}:8086/query?db=${
      query.db
    }&q=${encodeURIComponent(query.query)}`;
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
          [key]:  item[1],
        }));
      } else {
        return defaultValue;
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      return defaultValue;
    }
  };

export { fetchFloatDataFromDB, fetchStringDataFromDB };