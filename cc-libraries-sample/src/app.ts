import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';

import appRoutes from './routes';

function main() {
    dotenv.config();
    const app = express();

    app.use(express.static('src/public'))

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    }))

    nunjucks.configure('src/views', {
        autoescape: true,
        express: app,
        noCache: true,
    });

    const PORT = process.env.PORT || 3000;

    app.use(express.json());

    app.use(appRoutes);
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

main();
