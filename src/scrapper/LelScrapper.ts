import {Page} from "puppeteer";
import {IMangaScrapper} from "./IMangaScrapper";

export class LelScrapper implements IMangaScrapper {
    constructor(page: Page) {
        this.page = page;
    }

    page: Page;
    visitedLink: { [key: string]: boolean; } = {};
    imageLinks: string[] = [];
    nextPageLink: string;

    async getNextPageLink(page: Page): Promise<string> {
        const urls = await page.$$eval(
            "a",
            (links, currentURL) => {
                return links
                    .filter((link) => link.text === 'Suiv')
                    .map((link) => new URL(link.getAttribute("href"), currentURL).href)
                    .filter((url) => url.startsWith("https"));
            },
            page.url()
        );
        return urls[0];
    }

    async getImageLinks(page: Page): Promise<string[] | null> {
        return await page.evaluate(() => {
            const imageDiv = document.getElementById("image");
            const table= imageDiv.getElementsByTagName('table');
            const images = table[0].getElementsByTagName('img')
            return Array.from(images).map(image => image.src)
        });
    }


    async scrap(): Promise<string[]> {
        const urls: string[] = [];
        let link = await this.getNextPageLink(this.page);
        while (Boolean(link) && !Boolean(this.visitedLink[link])) {
            await this.page.goto(link);
            const imagesLinks = await this.getImageLinks(this.page);
            urls.push(...imagesLinks);
            this.visitedLink[link] = true;
            link = await this.getNextPageLink(this.page);
        }

        return urls;
    }


}
