require("dotenv").config();
const axios = require("axios");

const baseURL = "https://cc-libraries.adobe.io/api/v1/libraries/";

(async () => {
  const options = {
    method: "post",
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
    url: baseURL,
    data: {
      name: "My Test Library"
    }
  };

  try {
    const response = await axios(options);

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
})();
