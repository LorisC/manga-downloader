import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DOWNLOAD_COMPLETED_EVENT, DOWNLOAD_MANGA_EVENT, DOWNLOAD_PROGRESS_EVENT } from '../events.constante';
import * as fs from 'node:fs';
import path from 'node:path';

type DownloadableFile = {
  id: string;
  path: string;
  available: boolean;
  downloaded: boolean;
  progress: number;
}

@Injectable()
export class FilesManagerService {
  constructor() {
  }

  private files: { [key: string]: DownloadableFile } = {};


  info(fileId: string) {
    if (!this.files[fileId]) {
      return null;
    }
    return this.files[fileId];
  }

  acknowledge(fileId: string) {
    const info = this.files[fileId];

    if (!info) {
      return null;
    }

    info.downloaded = true;

    const zipPath = path.join(__dirname, '..', '..',  info.path);
    console.log(zipPath);
    fs.unlinkSync(zipPath);

    delete this.files[fileId];

    return info;
  }

  @OnEvent(DOWNLOAD_MANGA_EVENT)
  handleDownloadMangaEvent(payload: { provider: string, url: string, id: string }) {
    if (!this.files.hasOwnProperty(payload.id)) {
      this.files[payload.id] = { path: '', id: payload.id, available: false, progress: 0, downloaded: false };
    }
  }

  @OnEvent(DOWNLOAD_COMPLETED_EVENT)
  handleDownloadCompleteEvent(payload: { zipLocation: string, id: string }) {
    if (this.files.hasOwnProperty(payload.id)) {
      this.files[payload.id].available = true;
      this.files[payload.id].path = payload.zipLocation;
    }
  }

  @OnEvent(DOWNLOAD_PROGRESS_EVENT)
  handleDownloadProgressEvent(payload: { id: string, progress: number }) {

    if (this.files.hasOwnProperty(payload.id)) {
      this.files[payload.id].progress = payload.progress;
    }
  }
}
