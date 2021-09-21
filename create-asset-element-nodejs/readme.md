# Creating an Asset-based Element: Node.js 

This sample shows how to create an asset-based element in a given library. From the user perspective, it represents the ability to upload an image to a library they select.

The sample uses Node.js and Express to create an application server. The server was bootstrapped with the [Express application generator](https://expressjs.com/en/starter/generator.html) and uses [EJS](https://ejs.co) for view templating.

## What it does

This sample:

1. Makes `GET` and `POST` requests to various CC Libraries API endpoints via routes defined in `routes/index.js`
2. Displays UI in the browser using:

- `views/index.ejs` as the view template for the uploading interface
- `views/success.ejs` as the view template for getting confirmation of a successful upload

## Setup

### 1. Add environment variables

Add a `.env` file to the top level of this sample with these keys:

```
API_KEY=
ACCESS_TOKEN=
```

See the Getting Your Developer Credentials tutorial to learn how to get values for these environment variables.

### 2. Run the sample

In your terminal, start the sample:

```
npm install
npm start
```

### 3. Open the page in your browser

Navigate to `localhost:3000` and try the app.
