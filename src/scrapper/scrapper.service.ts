import {Injectable} from '@nestjs/common';
import {IMangaScrapper} from "./IMangaScrapper";
import ScrapperFactory from "./scrapper.factory";

@Injectable()
export class ScrapperService {
    async scrap(site: string, url: string): Promise<Array<string>> {
        const scrapper: IMangaScrapper = await ScrapperFactory.getScrapper(site, url);

        return scrapper.scrap();
    }
}
