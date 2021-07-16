const axios = require("axios").create({
  baseURL: "https://cc-libraries.adobe.io/api/v1/libraries/",
  headers: {
    "x-api-key": process.env.API_KEY,
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  }
});

module.exports = {
  createLibrary: async name => {
    const options = {
      method: "post",
      url: "/",
      data: {
        name
      }
    };

    return axios(options);
  },
  updateLibrary: async (libraryId, name) => {
    const options = {
      method: "put",
      url: `${libraryId}/metadata`,
      data: {
        name
      }
    };

    return axios(options);
  },
  deleteLibrary: async libraryId => {
    const options = {
      method: "delete",
      url: libraryId
    };

    return axios(options);
  }
};
