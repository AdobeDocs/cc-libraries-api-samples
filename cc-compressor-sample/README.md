# CC Compressor Sample
This plugin is an example NodeJS app that you could deploy to a company server where you can select an image from my Libraries and then download a "web-optimised", minimised (by the server, e.g., via a TinyPNG API or something similar) rendition in a specific resolution.

## Install dependencies

First ensure that your terminal is in the root of this project. Then:

For `yarn` users, install all dependencies using:

```
yarn install
```

For `npm` users, install all dependencies using:

```
npm install
```

## Firestore Setup

Next, you need to create a `.env` file containing all the variables. Enter all variables from your Firebase project:

```sh
{
        echo 'SESSION_SECRET='
        echo 'API_KEY='
        echo 'API_SECRET='
        echo 'PORT='
        echo 'TINIFY_API_KEY='

} >> .env
```

## Launch the project

Run the following command for running the backend: 

```sh
npm run dev
```

> Note: On following the above steps, the project will run on your localhost server using `http` protocol. To use `https` please follow [this blog](https://web.dev/how-to-use-local-https/).
