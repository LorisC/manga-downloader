import * as crypto from 'node:crypto';
import {Controller, Get, Query} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { DOWNLOAD_MANGA_EVENT } from './events.constante';


@Controller()
export class AppController {
    constructor(private eventEmitter: EventEmitter2) {}

    @Get()
    async addJob(@Query() query: {site: string, url: string }) {
        const {site, url} = query;
        const data = `${site}/${url}`;
        const requestHash = crypto.createHash('md5').update(data).digest('hex');

        this.eventEmitter.emit(DOWNLOAD_MANGA_EVENT, {provider: site, url: url, id: requestHash});
        return requestHash;
    }
}
