require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const baseURL = "https://libraries.adobe.io/api/v1/libraries/";

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("index", { title: "CC Libraries API" });
});

module.exports = router;
