import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {ImageModule} from "./images_zipper/image.module";
import {ScrapperModule} from "./scrapper/scrapper.module";

@Module({
  imports: [ImageModule,ScrapperModule],
  controllers: [AppController],
})
export class AppModule {}
