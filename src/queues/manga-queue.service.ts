import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {MANGA_QUEUE_NAME} from "./manga-queue.processor";
import {  OnEvent } from '@nestjs/event-emitter';
import { DOWNLOAD_MANGA_EVENT } from '../events.constante';

@Injectable()
export class MangaQueueService {
    constructor(@InjectQueue(MANGA_QUEUE_NAME) private readonly queue: Queue) {}

    @OnEvent(DOWNLOAD_MANGA_EVENT)
    async handleDownloadMangaEvent(payload: { provider: string, url: string, id: string }) {
        await this.queue.add({ url: payload.url, provider: payload.provider, id: payload.id });
    }
}
