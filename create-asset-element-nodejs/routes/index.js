require("dotenv").config();
const fs = require("fs");
const FormData = require("form-data");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");
const upload = multer({ dest: "./tmp" });
const { writeLog } = require("../logger");

axios.defaults.baseURL = "https://cc-libraries.adobe.io/api/v1/libraries";
axios.defaults.headers = {
  "x-api-key": process.env.API_KEY,
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
};

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const response = await axios.get();

    res.render("index", {
      libraries: response.data.libraries,
    });
  } catch (error) {
    writeLog(error);

    res.render("index", {
      libraries: undefined,
    });
  }
});

router.post("/", upload.single("asset"), async (req, res, next) => {
  const { libraryUrn } = req.body;
  const { file } = req;

  let thumbnail;
  try {
    thumbnail = await uploadAsset(libraryUrn, file);
  } catch (error) {
    return next(error);
  }

  try {
    const responseJson = await createElement(libraryUrn, file, thumbnail);

    res.render("success", {
      responseJson,
    });
  } catch (error) {
    return next(error);
  }
});

const uploadAsset = async (libraryUrn, file) => {
  const imgData = fs.createReadStream(file.path);

  const formData = new FormData();
  formData.append("Representation-Content", imgData, "asset");
  formData.append(
    "Representation-Data",
    JSON.stringify({ type: file.mimetype })
  );

  const options = {
    method: "post",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
    },
    url: `/${libraryUrn}/representations/content`,
    data: formData,
  };

  try {
    const response = await axios(options);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const createElement = async (libraryUrn, file, thumbnail) => {
  const elementData = {
    name: file.originalname,
    type: "application/vnd.adobe.element.image+dcx",
    client: {
      deviceId: "Device ID",
      device: "Device name",
      app: "App name",
    },
    representations: [
      {
        type: file.mimetype,
        relationship: "rendition",
        storage_href: thumbnail.storage_href,
      },
    ],
  };

  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    url: `/${libraryUrn}/elements`,
    data: elementData,
  };

  try {
    const response = await axios(options);

    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = router;
