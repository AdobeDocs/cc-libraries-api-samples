# Getting Information about Libraries and Elements

This sample shows how to get information about:

- Your libraries
- A single library
- A single element

It uses Node.js and Express to create an application server. The server was bootstrapped with the [Express application generator](https://expressjs.com/en/starter/generator.html) and uses [EJS](https://ejs.co) for view templating.

## What it does

This sample:

1. Makes `GET` requests to various CC Libraries API endpoints via routes defined in `routes/index.js`
2. Displays the results in the browser using `views/index.ejs` as the view template

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

Naviate to `localhost:3000` and try the app.
