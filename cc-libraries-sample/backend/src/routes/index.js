const express = require("express");
const router = express.Router();
const url = require("url");
const axios = require("axios");

/*
Upon successful authentication and authorization, 
Adobe Identity Management will provide you with an object that
contains access/refresh tokens and limited user data like 
name and email address.

In lieu of having a database in this sample code, we will 
use the `adobeIdObj` variable to store the token/user data in memory.

This is not suitable for production.
*/
let adobeIdObj = null;

router.get("/", async (req, res, next) => {
  /*
  If there's a logged in Adobe ID stored as `adobeIdObj`,
  get the user properties we want to send to the browser for display.
  */
  let user =
    adobeIdObj && adobeIdObj.access_token
      ? {
          name: adobeIdObj.name,
          email: adobeIdObj.email,
        }
      : null;
  res.render("index", {
    title: "Creative Cloud Libraries + Adobe OAuth",
    user,
  });
});

/*
Prep and send the URL that the browser will use to display the Adobe auth screen.
On successful user authentication and authorization, Adobe Identity Management will
redirect the browser to the `redirect_uri` provided in the URL with a query
containing the authorization code needed to retrieve the user's access token.
*/
router.get("/adobe-auth/login", (req, res, next) => {
  const requestUrl = url.format({
    pathname: "https://ims-na1.adobelogin.com/ims/authorize/v2",
    query: {
      client_id: process.env.CLIENT_ID,
      scope: "openid,creative_sdk,email,profile",
      response_type: "code",
      redirect_uri: "https://localhost:8000/adobe-auth/login/token",
    },
  });

  res.send({ requestUrl });
});

/*
On successful authentication and authorization, Adobe Identity Management will
redirect the browser to this endpoint with a query containing the authorization 
code needed to retrieve the user's access token. We then POST a request to 
Adobe Identity Management with the authorization code. If we are successful,
we will receive a JSON response with access/refresh tokens and limited user 
data like name and email address.

In lieu of having a database in this sample, we store the response data
in memory as `adobeIdObj`, then redirect to the home page, which leverages
`adobeIdObj` when not null.
*/
router.get("/adobe-auth/login/token", async (req, res, next) => {
  let { code } = req.query;

  if (code && !adobeIdObj) {
    const requestUrl = url.format({
      pathname: "https://ims-na1.adobelogin.com/ims/token/v3",
      query: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
      },
    });

    try {
      const adobeResponse = await axios.post(requestUrl, {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      adobeIdObj = adobeResponse.data;
      res.redirect("/profile");
    } catch (error) {
      console.log("Unable to authenticate with Adobe IMS", error);
      next(error);
    }
  }
});

router.get("/profile", async (req, res, next) => {
  const options = {
    headers: {
      "x-api-key": process.env.CLIENT_ID,
      Authorization: `Bearer ${adobeIdObj.access_token}`,
    },
  };
  const uri = "https://ims-na1.adobelogin.com/ims/userinfo/v2";
  try {
    axios.get(uri, options)
    .then((adobeResponse)=>{
      adobeIdObj.name = adobeResponse.data.name;
      adobeIdObj.email = adobeResponse.data.email;
      res.redirect("/");
    })
  }catch (error) {
    console.log("Unable to get profile info", error.reason);
    next(error);
  }
});

/*
Prep and send the URL that the browser will use to log the user out of
their Adobe ID. 

Also, destroy the `adobeIdObj` containing user tokens and data on the server.
*/
router.get("/adobe-auth/logout", async (req, res, next) => {
  adobeIdObj = null;
  res.redirect("/");
});

/*
Get a list of the user's CC Libraries and send to the browser. In the headers
for the CC Libraries API request, pass your Client ID (as API key) and the
user's access token.
*/
router.get("/cc-libraries/data", async (req, res, next) => {
  const options = {
    headers: {
      "x-api-key": process.env.CLIENT_ID,
      Authorization: `Bearer ${adobeIdObj.access_token}`,
    },
  };

  try {
    const response = await axios.get(
      "https://cc-libraries.adobe.io/api/v1/libraries",
      options
    );
    res.json(response.data);
  } catch (error) {
    console.log("Unable to get CC Libraries", error);
    next(error);
  }
});

module.exports = router;
