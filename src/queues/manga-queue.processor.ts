import { Processor, Process, OnQueueCompleted, OnQueueProgress } from '@nestjs/bull';
import { Job } from 'bull';

import { ImageService } from '../images_zipper/image.service';
import { ScrapperService } from '../scrapper/scrapper.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DOWNLOAD_COMPLETED_EVENT, DOWNLOAD_PROGRESS_EVENT } from '../events.constante';

export const MANGA_QUEUE_NAME = 'manga-queue';

@Processor(MANGA_QUEUE_NAME)
export class MangaQueueProcessor {

  constructor(private readonly imageService: ImageService, private readonly scrapperService: ScrapperService, private eventEmitter: EventEmitter2) {
  }

  @Process({ concurrency: 4 })
  async handleJob(job: Job<{ url: string, provider: string, id: string }>) {
    const { url, provider, id } = job.data;
    const imageURLs = await this.scrapperService.scrap(provider, url, job);
    const zipLocation: string = await this.imageService.createZipWithImages(imageURLs, job);

    this.eventEmitter.emit(DOWNLOAD_COMPLETED_EVENT, { zipLocation, id });
  }

  @OnQueueProgress()
  handleProgress(job: Job<{ url: string, provider: string, id: string }>, progress: number) {
    this.eventEmitter.emit(DOWNLOAD_PROGRESS_EVENT, { id: job.data.id, progress });
  }

}
