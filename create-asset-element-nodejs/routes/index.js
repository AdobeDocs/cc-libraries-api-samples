require("dotenv").config();
const fs = require("fs");
const FormData = require("form-data");
const express = require("express");
const router = express.Router();
const {default: axios } = require("axios");
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
    thumbnail= await uploadAsset(libraryUrn, file);
  }catch(error) {
    return next(error);
  }
  try {
    const responseJson = await createElement(libraryUrn, file, thumbnail);
    res.render("success", {
      responseJson,
    });
  }catch(error){
    throw error;
  }
});

// NOTE: This method only works if file is under 5mb
// files under 5mb in size may be uploaded in one shot, files over 5mb must be broken into chunks
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
        content_length: thumbnail.content_length,
        etag: thumbnail.etag,
        md5: thumbnail.md5,
        version: thumbnail.version,
      },]
  };
  console.log(elementData)
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
    console.log(error.message);
  }
};

module.exports = router;
