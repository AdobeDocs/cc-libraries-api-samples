# Using I/O Events: Node.js

This sample shows how to use I/O Events with Creative Cloud Libraries from an interactive website running under Node.js.

## What it does

This sample allows you to trigger up to three events (library created, updated, and deleted) and then view the corresponding API and webhook responses.

### Create Library

This will send a `POST` request to `/libraries/` and create a new library named `My Test Library`. Afterwards, the API response will be logged and the `Library Created` event will trigger. Once received, the webhook response will also be logged.

### Update Library

This will create a new library named `NEW Test Library` and then send an `UPDATE` request to `/libraries/${libraryID}`. This will change the name of the library to `OLD Test Library` and cause the `Library Updated` event to trigger. Both the API responses as well as the webhook responses will also be logged.

### Delete Library

This will create a new library named `TEMP Test Library` and then send a `DELETE` request to `/libraries/${libraryID}`. This will delete the library and cause the `Library Deleted` event to trigger. Both the API responses as well as the webhook responses will also be logged.

## Setup

### 1. Add environment variables

Add a `.env` file to the top level of this sample with these keys:

```
API_KEY=
ACCESS_TOKEN=
```

See the [How To Get Your Developer Credentials](https://www.adobe.io/creative-cloud-libraries/docs/integrate/setup/developer-credentials/) tutorial to learn how to get values for these environment variables.

*NOTE:* The access token must be generated with the following scopes

- openid
- creative_sdk
- cc_files
- cc_libraries

### 2. Run the sample

In your terminal, start the sample:

```
npm install
npm start
```

*NOTE:* Make note of publicly available URL. It should look similar to the following `https://...ngrok.io/webhook`. This will be used in section 3 as the webhook URL.

### 2. Register an event

In your project overview in the Adobe Developer Console, click on `Add to Project` and choose `Event`. From there, select `Creative Cloud Libraries` and go to the next page.

On the `Choose event subscriptions` page, subscribe to all of the listed events by clicking on their corresponding checkboxes. After, continue to the next page.

Next, choose `OAuth` as the authentication type. On the next page, choose the same OAuth platform and redirection settings as in section 1 (most likely `Web` with the default redirection URLs).

Next, on the `Event registration details` page, choose a name and description for the event. For the webhook URL, use the publicly available URL printed to your terminal from section 2. Once done, click on `Save configured events` to register the event.
