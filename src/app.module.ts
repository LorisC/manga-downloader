import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {AppController} from './app.controller';
import {MangaQueueModule} from "./queues/manga-queue.module";


@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379
            }
        }),
        MangaQueueModule,
    ],
    controllers: [AppController],
})
export class AppModule {
}
