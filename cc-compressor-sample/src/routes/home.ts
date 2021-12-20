import express from 'express';
import { CCAPI } from '../util/ccApi';

const router = express.Router();

router.get('/', async (req, res) => {
    const loggedIn = req.session.accessToken !== undefined;

    let libraries;
    if (loggedIn) {
        const api = new CCAPI(req.session.accessToken);
        libraries = (await api.getLibraries()).libraries;
    }
    res.render('home.html', {
        loggedIn: req.session.accessToken !== undefined,
        libraries,
    });
})


export default router;
