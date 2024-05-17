import {IMangaScrapper} from "./IMangaScrapper";
import {LelScrapper} from "./LelScrapper";
import {RizzScrapper} from "./RizzScrapper";
import {Browser, Page} from "puppeteer";
import * as puppeteer from "puppeteer";
import {AsuraScrapper} from "./AsuraScrapper";

export const LEL_SCANS_NAME = "LelScan";
export const ASURA_SCANS = "ASURA";

export default class ScrapperFactory {
    static async getScrapper(name: string, url: string): Promise<IMangaScrapper> {
        const page = await this.getPage(url);
        switch (name) {
            case LEL_SCANS_NAME :
                return new LelScrapper(page);
            case ASURA_SCANS:
                return new AsuraScrapper(page);
            default:
                return new RizzScrapper(page);
        }
    }

    static async getPage(url: string): Promise<Page> {
        const browser: Browser = await puppeteer.launch({
            args: [
                "--disable-dev-shm-usage",
                "--no-sandbox",
                "--disable-setuid-sandbox",
            ],
        });

        const page: Page = await browser.newPage();
        await page.goto(url);
        return page;
    }
}
