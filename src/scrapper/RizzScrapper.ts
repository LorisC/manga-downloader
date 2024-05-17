import {IMangaScrapper} from "./IMangaScrapper";
import {Page} from "puppeteer";

export class RizzScrapper implements IMangaScrapper {
    async getNextPageLink(page: Page): Promise<string | null> {
        const urls = await page.$$eval(
            "a.ch-next-btn",
            (links, currentURL) => {
                return links
                    .map((link) => link.getAttribute("href"))
                    .map((href) => new URL(href, currentURL).href)
                    .filter((url) => url.startsWith("https"));
            },
            page.url()
        );

        console.log(urls);
        return urls[0];
    }

    async getImageLinks(page: Page): Promise<string[] | null> {
        const urls = await page.$$eval(
            '#readerarea img',
            (images, currentUrl) => {
                return images
                    .map(image => new URL(image.getAttribute('href'), currentUrl).href)
                    .filter(url => url.startsWith('https') && url.endsWith('webp'));
            },
            page.url()
        );
        console.log(urls);
        return urls;
    }

    imageLinks: string[];
    nextPageLink: string;
    page: Page;
    visitedLink: { [key: string]: boolean };

    constructor(page: Page) {
        this.page = page;
    }

    scrap(): Promise<string[] | null> {
        return Promise.resolve(undefined);
    }
}
