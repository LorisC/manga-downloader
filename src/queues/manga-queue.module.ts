import {Module} from '@nestjs/common';
import {BullModule} from "@nestjs/bull";
import {ImageModule} from "../images_zipper/image.module";
import {ScrapperModule} from "../scrapper/scrapper.module";
import {MangaQueueService} from "./manga-queue.service";
import {MANGA_QUEUE_NAME, MangaQueueProcessor} from "./manga-queue.processor";


@Module({
    imports: [
        BullModule.registerQueue(
            {
                name: MANGA_QUEUE_NAME
            }),
        ImageModule,
        ScrapperModule,
    ],
    exports:[MangaQueueService],
    providers: [MangaQueueService, MangaQueueProcessor]
})
export class MangaQueueModule {
}
