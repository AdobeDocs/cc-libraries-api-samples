import express from 'express';
import { CCAPI } from '../util/ccApi';
import tinify from 'tinify';

const router = express.Router();

router.get('/:id/elements', async (req, res) => {
    const api = new CCAPI(req.session.accessToken);
    const elements = (await api.getLibraryElements(req.params.id)).elements;

    const imageElements: any[] = [];
    await Promise.all(elements.map(async (element: any) => {
        if (element.type === 'application/vnd.adobe.element.image+dcx') {
            element.thumbnail.image = await api.getImage(element.thumbnail.rendition);
            element.imageUrl = element.thumbnail.rendition.replace(/&size=\d+/, '')
            imageElements.push(element);
        }
    }
    ));
    res.render("elements.html", {
        elements: imageElements,
    });
});

router.get('/compress', async (req, res) => {
    const url = req.query.url as string;
    tinify.key = process.env.TINIFY_API_KEY;
    const api = new CCAPI(req.session.accessToken);
    const image = await api.getImageBuffer(url);

    tinify.fromBuffer(image.data).toBuffer((err, result) => {
        res.set({
            "Content-Type": image.headers["content-type"],
            'Content-disposition': 'attachment;filename=compressed.png',
            'Content-Length': image.data.length,

        });
        res.send(result);
    })
});

export default router;