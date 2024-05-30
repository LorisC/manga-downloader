import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {AppController} from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MangaQueueModule } from './queues/manga-queue.module';
import { FilesManagerModule } from './files_manager/files-manager.module';

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379
            }
        }),
        MangaQueueModule,
        FilesManagerModule,
        EventEmitterModule.forRoot()
    ],
    controllers: [AppController],
})
export class AppModule {
}
