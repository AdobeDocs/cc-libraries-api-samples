# CC Libraries API Sample: Node.js + Express

This sample will use Node.js and Express to build an app that: 
1. Runs on `https://localhost:3000`
2. Sets up authentication using the [OAuth 2.0](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/OAuth/OAuth.md) 
3. Create routes to make calls to CC Libraries API endpoints

## Technology Used

1. Node.js and the `npm` package manager
1. Express 
1. Axios 
1. `ejs` as the view templating engine

## Prerequisites 

First, let's set up the application for OAuth 2.0. Make sure you have a registered app (project) on the Adobe Developer Console with the following settings: 

1. `Platform`: web
2. `Redirect URI`: `https://localhost:3000/callback`
3. `Redirect URI pattern`; `https://localhost:3000/callback`

## Configuration

The following steps will help you get this sample up and running. First, clone or fork the repo. 

### Install Node.js packages 

The `package.json` list contains the dependencies we need for this project. Run the following command from the top level directory of the app to install these dependencies: 

```
$ npm install 
```

### Store your Client ID and Client Secret as Environment Variables 

Set up a `.env` file to store the client ID and client secret. You can use the `.env.example` file as a guideline.

Create it on the same level as the `package.json` file -- you should see that it is already included in the `.gitignore` file to ensure that our source control history won't contain references to your secrets. 

```
API_KEY=######################
API_SECRET=###################
```

### Configure OpenSSL Credentials

Install [`mkcert`](https://github.com/FiloSottile/mkcert) on your machine. `mkcert` is a simple tool for making locally-trusted development certificates. It automatically creates and installs a local CA in the system root store, and generates locally-trusted certificates. After you configure the tool with:
```
$ mkcert -install
````
You can then navigate back to this project folder and run:
```
$ mkcert localhost
```
This will generate two files: `localhost-key.pem` (key) and `localhost.pem` (certificate). Our https server is instantiated with these two files so that the browser trusts localhost. 

## Usage

After completing the configuration steps, start the server:

```
$ npm start
```

To access the app, go to `https://localhost:3000`. 