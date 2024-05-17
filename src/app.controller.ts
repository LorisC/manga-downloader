import {Controller, Get,  Query, Res} from '@nestjs/common';

import * as archiver from "archiver";

import {ImageService} from "./images_zipper/image.service";
import {ScrapperService} from "./scrapper/scrapper.service";

@Controller()
export class AppController {
    constructor(private readonly imageService: ImageService, private readonly scrapperService: ScrapperService) {
    }

    @Get()
    async downloadManga(@Query() query, @Res() res,): Promise<void> {
        const imageURLs = await this.scrapperService.scrap(query.site, query.url)
        const images = await this.imageService.getImages(imageURLs);
        await this.createZip(images, res);
    }

    async createZip(
        files: { data: any; name: string }[],
        output: NodeJS.WritableStream
    ) {
        return new Promise((resolve, reject) => {

            const archive = archiver("zip", {
                zlib: { level: 9 },
            });
            archive.pipe(output);

            output.on("end", resolve);
            output.on("close", resolve);
            archive.on("warning", (err) => {
                if (err.code === "ENOENT") {
                    // log warning
                } else {
                    // throw error
                    throw err;
                }
            });

            archive.on("error", (err) => {
                reject(err);
            });

            for (const file of files) {
                archive.append(file.data, { name: file.name });
            }
            archive.finalize();
        });
    }
}
