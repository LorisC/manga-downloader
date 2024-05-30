import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'node:fs';
import * as path from 'node:path';
import AdmZip from 'adm-zip';
import { Job } from 'bull';


@Injectable()
export class ImageService {

  async downloadImage(url: string, path) {
    const response = await axios({
      url,
      responseType: 'arraybuffer',
    });
    fs.writeFileSync(path, response.data);
  }

  async createZipWithImages(imageUrls: string[], job: Job) {
    const zip = AdmZip();
    const downloadFolder = path.join(__dirname, 'downloads');
    let progress = job.progress();
    // Ensure download folder exists
    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder);
    }

    // Download each image and add to the zip
    for (const url of imageUrls) {
      const fileName = path.basename(url);
      const outputPath = path.join(downloadFolder, fileName);
      await this.downloadImage(url, outputPath);
      zip.addLocalFile(outputPath);
      progress++;
      await job.progress(progress);
    }

    const zipFilename = 'images_' + Date.now() + '.zip';
    // Define the output zip file path
    const zipPath = path.join(__dirname, '..', '..', 'public', zipFilename);
    zip.writeZip(zipPath);

    // Clean up downloaded files
    fs.readdirSync(downloadFolder).forEach(file => {
      fs.unlinkSync(path.join(downloadFolder, file));
    });
    fs.rmdirSync(downloadFolder);

    return (`public/${zipFilename}`);
  };


}
