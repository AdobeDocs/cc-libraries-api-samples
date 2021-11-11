import express from 'express';
import oauthRouter from './oauth';
import homeRouter from './home';
import librariesRouter from './libraries';

const router = express.Router();

router.use('/oauth', oauthRouter);
router.use('/libraries', librariesRouter);
router.use('/', homeRouter);

export default router;
