import axios, { AxiosInstance } from "axios";

export class CCAPI {

    api: AxiosInstance;

    constructor(accessToken: string) {
        this.api = axios.create({
            baseURL: 'https://cc-libraries.adobe.io/api/v1/libraries',
            headers: {
                "x-api-key": process.env.API_KEY,
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }


    public async getLibraries() {
        const res = await this.api.get('/')
        return res.data;
    }

    public async getLibraryElements(libraryId: string) {
        const res = await this.api.get(`${libraryId}/elements`);
        return res.data;
    }

    public async getImage(storageUrl: string) {
        console.log(storageUrl);
        const res = await this.api.get(storageUrl, {responseType: "arraybuffer", headers: {
            Accept: '*/*',
        }});
        const base64flag = `data:${res.headers["content-type"]};base64,`;
        const base64string = Buffer.from(res.data, "binary").toString("base64");
        return `${base64flag}${base64string}`;
    }

    public async getImageBuffer(storageUrl: string) {
        console.log(storageUrl);
        const res = await this.api.get(storageUrl, {responseType: "arraybuffer", headers: {
            Accept: '*/*',
        }});
        return res;
    }
}