import dotenv from 'dotenv'
dotenv.config();
import express from "express";
import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';



// on your node server
const unsplash = createApi({
  accessKey: process.env.ACCESS_KEY,
  fetch: nodeFetch
});

unsplash.search.getPhotos({ query: 'cat', page: 1, perPage: 10 }).then(result => {
  if (result.errors) {
    // handle error here
    console.log('error occurred: ', result.errors[0]);
  } else {
    // handle success here
    const photo = result.response;
    console.log(photo);
  }
});

