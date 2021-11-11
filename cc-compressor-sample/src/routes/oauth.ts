import express from 'express';
import axios from 'axios';

const router = express.Router();

const baseURL = "https://cc-libraries.adobe.io/api/v1/libraries";
const scopes = 'openid,creative_sdk,profile,address,AdobeID,email,cc_files,cc_libraries';
const redirect_uri = 'https://localhost:3000/oauth/callback/'

router.get('/login', async function (req, res, next) {
    /* This will prompt user with the Adobe auth screen */
    res.redirect(`https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${process.env.API_KEY}&scope=${scopes}&response_type=code&redirect_uri=${redirect_uri}`)
});

router.get('/callback', async (req, res, next) => {
    let code = req.query.code;
    let grant_type_ = 'authorization_code';
    let uri = `https://ims-na1.adobelogin.com/ims/token/v3?grant_type=authorization_code&client_id=${process.env.API_KEY}&client_secret=${process.env.API_SECRET}&code=${code}&grant_type=${grant_type_}`;
    try {
        const response = await axios.post(uri)
        req.session.accessToken = response.data.access_token;
        req.session.refreshToken = response.data.refresh_token;
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.render('index', { title: 'Login failed' })
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {});
    res.redirect('/');
})

export default router;
