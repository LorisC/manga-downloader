import {IMangaScrapper} from "./IMangaScrapper";
import {LelScrapper} from "./LelScrapper";
import {RizzScrapper} from "./RizzScrapper";

import {AsuraScrapper} from "./AsuraScrapper";
import {CustomBrowser} from "./CustomBrowser";

export const LEL_SCANS_NAME = "LelScan";
export const ASURA_SCANS = "ASURA";
export const RIZZ_SCANS= "RIZZ"

export default class ScrapperFactory {

    static async getScrapper(name: string, url: string): Promise<IMangaScrapper> {
        const page = await CustomBrowser.getPage(url);
        switch (name) {
            case LEL_SCANS_NAME :
                return new LelScrapper(page);
            case ASURA_SCANS:
                return new AsuraScrapper(page);
            case RIZZ_SCANS:
                return new RizzScrapper(page);
            default:
                return new RizzScrapper(page);
        }
    }
}
