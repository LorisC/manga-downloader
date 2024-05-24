import {IMangaScrapper} from "./IMangaScrapper";
import {Page} from "puppeteer";
import {Job, Queue} from "bull";

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


        return urls[0];
    }

    async getImageLinks(page: Page): Promise<string[] | null> {
        const htmlContent = await page.content();
        await page.waitForSelector('#readerarea');
        const urls = await page.evaluate(
            (currentUrl) => {
                const images = Array.from(document.querySelectorAll('#readerarea img'));
                const urls = images
                    .map(image => image.getAttribute('src'))
                    .map(src => new URL(src, currentUrl).href)
                    .filter(url => url.startsWith('https') && url.endsWith('webp'));
                return { urls, log: `Found ${urls.length} images`, nbImage: images.length };
            },
            page.url()
        );
        return urls.urls;
    }

    imageLinks: string[] = [];
    nextPageLink: string;
    page: Page;
    visitedLink: { [key: string]: boolean } = {};

    constructor(page: Page) {
        this.page = page;
    }

    async scrap(job: Job): Promise<string[] | null> {
        let nextPageLink: string | null = this.page.url();
        let progress = 0;
        while (nextPageLink) {
            if (this.visitedLink[nextPageLink]) {
                break;
            }

            this.visitedLink[nextPageLink] = true;

            await job.progress(progress)
            progress++;
            await this.page.goto(nextPageLink, { waitUntil: 'networkidle2' });

            const imageLinks = await this.getImageLinks(this.page);
            if (imageLinks) {
                this.imageLinks.push(...imageLinks);
            }

            nextPageLink = await this.getNextPageLink(this.page);
        }

        return this.imageLinks.length ? this.imageLinks : null;
    }
}
