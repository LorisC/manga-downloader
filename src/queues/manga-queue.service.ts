import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {MANGA_QUEUE_NAME} from "./manga-queue.processor";

@Injectable()
export class MangaQueueService {
    constructor(@InjectQueue(MANGA_QUEUE_NAME) private readonly queue: Queue) {}

    async addJob(provider: string, url: string,) {
        await this.queue.add({ url, provider });
    }
}
