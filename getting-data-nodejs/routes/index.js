require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const baseURL = "https://libraries.adobe.io/api/v1/libraries";

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("index", { title: "CC Libraries API" });
});

router.get("/cc-libraries/data", async (req, res, next) => {
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
    console.error(error);
    next(error);
  }
});

router.get("/cc-libraries/data/:libraryId", async (req, res, next) => {
  const { libraryId } = req.params;

  const options = {
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await axios.get(
      `${baseURL}/${libraryId}/elements`,
      options
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get(
  "/cc-libraries/data/:libraryId/:elementId",
  async (req, res, next) => {
    const { libraryId, elementId } = req.params;

    const options = {
      headers: {
        "x-api-key": process.env.API_KEY,
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseURL}/${libraryId}/elements/${elementId}`,
        options
      );

      res.json(response.data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get("/cc-libraries/image", async (req, res, next) => {
  let { url } = req.query;
  url = url.slice(0, url.lastIndexOf("/"));

  const options = {
    responseType: "arraybuffer",
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await axios.get(url, options);
    const dataUrl = await getBase64dataUrl(response);

    res.set("Content-Type", response.headers["content-type"]);
    res.set("Content-Length", response.headers["content-length"]);
    res.send(dataUrl);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const getBase64dataUrl = async (response) => {
  const base64flag = `data:${response.headers["content-type"]};base64,`;
  const base64string = Buffer.from(response.data, "binary").toString("base64");

  return `${base64flag}${base64string}`;
};

module.exports = router;
