import {Controller, Get, Query} from '@nestjs/common';

import {MangaQueueService} from "./queues/manga-queue.service";

@Controller()
export class AppController {
    constructor(
        private readonly mangaQueueService: MangaQueueService) {
    }

    @Get()
    async addJob(@Query() query) {
        await this.mangaQueueService.addJob(query.site, query.url)
        return "Job added"
    }

    // @Get()
    // async downloadManga(@Query() query, @Res() res,): Promise<void> {
    //     const imageURLs = await this.scrapperService.scrap(query.site, query.url)
    //     const images = await this.imageService.getImages(imageURLs);
    //     await this.createZip(images, res);
    // }
    //
    // async createZip(
    //     files: { data: any; name: string }[],
    //     output: NodeJS.WritableStream
    // ) {
    //     return new Promise((resolve, reject) => {
    //
    //         const archive = archiver("zip", {
    //             zlib: { level: 9 },
    //         });
    //         archive.pipe(output);
    //
    //         output.on("end", resolve);
    //         output.on("close", resolve);
    //         archive.on("warning", (err) => {
    //             if (err.code === "ENOENT") {
    //                 // log warning
    //             } else {
    //                 // throw error
    //                 throw err;
    //             }
    //         });
    //
    //         archive.on("error", (err) => {
    //             reject(err);
    //         });
    //
    //         for (const file of files) {
    //             archive.append(file.data, { name: file.name });
    //         }
    //         archive.finalize();
    //     });
    // }
}
