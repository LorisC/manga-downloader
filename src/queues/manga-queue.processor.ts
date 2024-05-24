import {Processor, Process, InjectQueue} from '@nestjs/bull';
import {Job} from 'bull';

import {ImageService} from "../images_zipper/image.service";
import {ScrapperService} from "../scrapper/scrapper.service";

export const MANGA_QUEUE_NAME = 'manga-queue';

@Processor(MANGA_QUEUE_NAME)
export class MangaQueueProcessor {

    constructor(private readonly imageService: ImageService, private readonly scrapperService: ScrapperService) {}

    @Process({concurrency: 4})
    async handleJob(job: Job<{ url: string, provider: string }>) {

        const {url, provider} = job.data;
        const imageURLs = await this.scrapperService.scrap(provider, url, job)
        const path = await this.imageService.createZipWithImages(imageURLs, job);

        console.log(url, provider, path)

        return path;
    }
}
