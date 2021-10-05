require("dotenv").config();
const express = require("express");
const router = express.Router();
const {default: axios }= require("axios"); // Be sure to require axios
const FormData = require("form-data");
const multer = require("multer");
const upload = multer({ dest: "./tmp" });
const fs = require("fs");

const baseURL = "https://cc-libraries.adobe.io/api/v1/libraries";
const scopes = 'openid,creative_sdk,profile,address,AdobeID,email,cc_files,cc_libraries';
const redirect_uri = 'https://localhost:3000/callback/'

// The default GET route provided by express-generator
router.get("/", async function(req, res, next) {
  const options = {
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${req.session.accessToken}`,
    },
  };
  try {
    const response = await axios.get(baseURL, options);
    res.render("index", {
      title: "Creative Cloud Libraries API",
      libraries: response.data.libraries,
    });
  } catch (error) {
    console.log(error);

    res.render("index", {
      title: "Creative Cloud Libraries API",
      libraries: undefined,
    });
  }
});

router.get('/login', async function(req, res, next) {
/* This will prompt user with the Adobe auth screen */
  res.redirect(`https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${process.env.API_KEY}&scope=${scopes}&response_type=code&redirect_uri=${redirect_uri}`)
});

router.get('/callback', async (req, res, next) => {
  let code = req.query.code; 
  let grant_type_ = 'authorization_code';
  let uri = `https://ims-na1.adobelogin.com/ims/token/v3?grant_type=authorization_code&client_id=${process.env.API_KEY}&client_secret=${process.env.API_SECRET}&code=${code}&grant_type=${grant_type_}`;
  try{
    const response = await axios.post(uri)
    req.session.accessToken = response.data.access_token;
    req.session.refreshToken = response.data.refresh_token;
    res.redirect('/');
    //res.render('index', {title:'Login Succeeded!', libraries : ''});
  } catch(error){
    console.log(error);
    res.render('index', {title:'Login failed'})
  }
});

router.get("/refresh", async (req, res, next) => {
  var uri = `https://ims-na1.adobelogin.com/ims/token/v3?client_id=${process.env.API_KEY}&refresh_token=${req.session.refreshToken}&grant_type=${grant_type_}`
  var grant_type_ = "refresh_token"
  try {
    const response = await axios.get(uri);
    req.session.accessToken = response.data.access_token;
    req.session.refreshToken = response.data.refresh_token;
    res.redirect('/');
  } catch (error) {
    console.log(error);
    next(error);
  }
})

// Get metadata about all of the user's libraries
router.get("/cc-libraries/data", async (req, res, next) => {
    const options = {
      headers: {
        "x-api-key": process.env.API_KEY,
        Authorization: `Bearer ${req.session.accessToken}`,
      },
    };

    try {
      const response = await axios.get(baseURL, options);
      res.json(response.data);
    } catch (error) {
      console.log(error);
      next(error);
    }
});

// Get metadata for a specific Library's elements 
router.get("/cc-libraries/data/:libraryId", async (req, res, next) => {
  const { libraryId } = req.params;

  const options = {
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${req.session.accessToken}`,
    },
  };

  try {
    const response = await axios.get(
      `${baseURL}/${libraryId}/elements`,
      options
    );
    res.json(response.data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Get metadata for specific element in specific library 
router.get("/cc-libraries/data/:libraryId/:elementId", async (req, res, next) => {
  const { libraryId, elementId } = req.params;
  const options = {
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${req.session.accessToken}`,
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
});


router.get("/cc-libraries/image", async (req, res, next) => {
  let { url } = req.query;
  url = url.slice(0, url.lastIndexOf("/")); // See the Info box below
  const options = {
    responseType: "arraybuffer",
    headers: {
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${req.session.accessToken}`,
      "Accept": "*/*",
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

router.post("/", upload.single("asset"), async (req, res, next) => {
  const { libraryUrn } = req.body;
  const { file } = req;

  let thumbnail;
  try {
    thumbnail= await uploadAsset(libraryUrn, file, req);
  }catch(error) {
    console.log("here")
    return next(error);
  }
  try {
    const responseJson = await createElement(libraryUrn, file, thumbnail, req);
    res.render("success", {
      responseJson,
    });
  }catch(error){
    throw error;
  }
});

// NOTE: This method only works if file is under 5mb
// files under 5mb in size may be uploaded in one shot, files over 5mb must be broken into chunks
const uploadAsset = async (libraryUrn, file, req) => {
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
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${req.session.accessToken}`,
      "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
    },
    url: `${baseURL}/${libraryUrn}/representations/content`,
    data: formData,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.log("can't upload")
    console.log(error)
    throw error;
  }
};

const createElement = async (libraryUrn, file, thumbnail, req) => {
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
      "x-api-key": process.env.API_KEY,
      Authorization: `Bearer ${req.session.accessToken}`,
      "Content-Type": "application/json",
    },
    url: `${baseURL}/${libraryUrn}/elements`,
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

