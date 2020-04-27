require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const baseURL = "https://libraries.adobe.io/api/v1/libraries";

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
    console.log(error);
  }
});

router.get("/cc-libraries/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  const options = {
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await axios.get(`${baseURL}/${id}/elements`, options);
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
