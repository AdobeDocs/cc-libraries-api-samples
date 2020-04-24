require("dotenv").config();
const axios = require("axios");

const baseURL = "https://libraries.adobe.io/api/v1/libraries/";

(async () => {
  const options = {
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await axios.get(baseURL, options);
    console.log(response.data);
  } catch (error) {
    console.log(error.response.data, error.config);
  }
})();
