import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {createBullBoard} from "@bull-board/api";
import {Queue} from "bull";
import {getQueueToken} from "@nestjs/bull";
import {MANGA_QUEUE_NAME} from "./queues/manga-queue.processor";
import {ExpressAdapter} from "@bull-board/express";
import {BullAdapter} from "@bull-board/api/bullAdapter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);const serverAdapter = new ExpressAdapter();

  serverAdapter.setBasePath('/admin/queues');
  const mangaQueue = app.get<Queue>(getQueueToken(MANGA_QUEUE_NAME));

  createBullBoard({
    queues: [new BullAdapter(mangaQueue)],
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());

  await app.listen(3020);
}

bootstrap();
