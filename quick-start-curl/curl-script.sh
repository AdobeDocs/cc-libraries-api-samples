#!/bin/sh

curl --location --request GET \
  https://cc-libraries.adobe.io/api/v1/libraries \
  -H 'x-api-key: <API_KEY_HERE>' \
  -H 'Authorization: Bearer <TOKEN_HERE>'