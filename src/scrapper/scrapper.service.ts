import {Injectable} from '@nestjs/common';
import {IMangaScrapper} from "./IMangaScrapper";
import ScrapperFactory from "./scrapper.factory";
import {Job} from "bull";
import {CustomBrowser} from "./CustomBrowser";

@Injectable()
export class ScrapperService {
    async scrap(site: string, url: string, job: Job): Promise<Array<string>> {
        const scrapper: IMangaScrapper = await ScrapperFactory.getScrapper(site, url);

        const result = await scrapper.scrap(job);

        await CustomBrowser.closeBrowser();
        return result;
    }
}
