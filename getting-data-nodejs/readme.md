# Getting Library and Element Data: Node.js

This sample shows how to get information about:

- Your libraries
- A single library
- A single element (including an image)

It uses Node.js and Express to create an application server. The server was bootstrapped with the [Express application generator](https://expressjs.com/en/starter/generator.html) and uses [EJS](https://ejs.co) for view templating.

## What it does

This sample:

1. Makes `GET` requests to various CC Libraries API endpoints via routes defined in `routes/index.js`
2. Displays the results in the browser using:
  - `views/index.ejs` as the view template
  - `public/javascripts/cc-libraries.js` for the client-side JavaScript

## Setup

### 1. Add environment variables

Add a `.env` file to the top level of this sample with these keys:

```
API_KEY=
ACCESS_TOKEN=
```

See the [How To Get Your Developer Credentials](https://www.adobe.io/creative-cloud-libraries/docs/integrate/setup/developer-credentials/) tutorial to learn how to get values for these environment variables.

### 2. Run the sample

In your terminal, start the sample:

```
npm install
npm start
```

### 3. Open the page in your browser

Navigate to `localhost:3000` and try the app.
