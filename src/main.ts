import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {createBullBoard} from "@bull-board/api";
import {Queue} from "bull";
import {getQueueToken} from "@nestjs/bull";
import {MANGA_QUEUE_NAME} from "./queues/manga-queue.processor";
import {ExpressAdapter} from "@bull-board/express";
import {BullAdapter} from "@bull-board/api/bullAdapter";
import * as express from 'express';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);const serverAdapter = new ExpressAdapter();

  serverAdapter.setBasePath('/admin/queues');
  const mangaQueue = app.get<Queue>(getQueueToken(MANGA_QUEUE_NAME));

  createBullBoard({
    queues: [new BullAdapter(mangaQueue)],
    serverAdapter,
  });
  app.enableCors({
    origin: 'http://localhost:5173', // replace with your client origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  app.use('/admin/queues', serverAdapter.getRouter());


  app.use('/public', express.static(join(__dirname, '..', 'public')));

  await app.listen(3020);
}

bootstrap();
