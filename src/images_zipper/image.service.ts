import {Injectable} from "@nestjs/common";
import axios from "axios";

@Injectable()
export class ImageService {
    async getImages(urls: Array<string>): Promise<any> {
        const images = [];

        for (const url of urls) {
            try {
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                    responseEncoding: "binary",
                });
                const image = response.data;
                images.push({data:image, name:url.split('?')[0]});
            } catch (error) {
                console.log(error);
            }
        }

        return images;
    }
}
