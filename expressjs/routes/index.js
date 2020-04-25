require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const baseURL = "https://libraries.adobe.io/api/v1/libraries/";

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("index", { title: "CC Libraries API" });
});

router.get("/cc-libraries", async (req, res, next) => {
  const options = {
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await axios.get(baseURL, options);
    res.json(response.data);
  } catch (error) {
    console.log(error.response.data, error.config);
  }
});

module.exports = router;
