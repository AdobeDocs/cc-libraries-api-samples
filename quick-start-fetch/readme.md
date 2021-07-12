# Fetch

This sample shows how to make a call from the browser using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

WARNING: At the moment, you may encouter CORS errors when calling the API from the browser.

## What it does

This sample creates a very basic website with a button that when clicked, will list the libraries you have access to on the page using a `GET` request to the `/libraries/` endpoint.

## Setup

### 1. Add client ID and secret

Create a `variables.mjs` in the `modules` directory with your credentials:

```
export function getAPIKey() {
    return "<your API key>";
}

export function getAccessToken() {
    return "<your access token>";
}
```

See the [How To Get Your Developer Credentials](https://www.adobe.io/creative-cloud-libraries/docs/integrate/setup/developer-credentials/) tutorial to learn how to get values for these variables.

### 2. Run the sample

Load `index.html` in your browser directly or use a web server like [http-server](https://www.npmjs.com/package/http-server) to serve the files via localhost.

TODO: Address CORS issues
