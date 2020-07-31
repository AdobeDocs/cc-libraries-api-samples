# CC Libraries + Adobe OAuth

## What it does

This sample app lets the user:

- Log in with their Adobe ID
- Authorize the app to access their data stored in Creative Cloud
- See the name and email address associated with their Adobe ID
- Get a list of library names stored in CC Libraries
- Log out of their Adobe ID

## Setup

### Register a project on the Adobe Developer Console

1. Create a new Adobe Developer Console project
2. Add "Creative SDK" to the project
3. Select "OAuth 2.0" for your authentication method
4. For both "Redirect URI" and "Redirect URI Pattern" enter `https://localhost:8000` (note that `https` is required)
5. Copy your Client ID and Client Secret for use in one of the following steps

### Clone the repo and install dependencies

```shell
% git clone <repo-url>
% cd <repo-name>
% npm install
```

### Set your environment variables

```shell
% touch .env
```

In `.env`, add these variables:

```
NODE_ENV=development
CLIENT_ID=
CLIENT_SECRET=
```

Your `CLIENT_ID` and `CLIENT_SECRET` can be retrieved from the Adobe Developer Console project we created in an earlier step.

### Create your cert

Adobe OAuth 2.0 requires SSL, so you will need to create a self-signed cert using the OpenSSL CLI.

Be sure to run the OpenSSL CLI command in the repo's `bin` directory:

```shell
% cd bin
% openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

Make sure that after running this command you have the `cert.pem` and `key.pem` files at the top level of the `bin` directory.

## Usage

After completing the setup steps, start the server:

```shell
% cd .. # only if you are still cd'd into /bin
% npm start # at the root directory of the repo
```

To access the app, go to `https://localhost:8000`. Click through any cert warnings in the browser.

## Where things are

### Server

For info on the OAuth workflow, see comments in `src/routes/index.js`.

### Browser

For browser-side markup, see `src/views/index.ejs`.

For browser-side JavaScript, see `src/public/javascripts/index.js`.
