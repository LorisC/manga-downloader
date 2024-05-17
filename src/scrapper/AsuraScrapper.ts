import {Page} from "puppeteer";
import {IMangaScrapper} from "./IMangaScrapper";

export class AsuraScrapper implements IMangaScrapper {
    constructor(page: Page) {
        this.page = page;
    }

    page: Page;
    visitedLink: { [key: string]: boolean; };
    imageLinks: string[];
    nextPageLink: string;

    async getNextPageLink(page: Page): Promise<string> {
        return await page.evaluate(() => {
            const anchorCollection = document.getElementsByClassName('ch-next-btn');
            return anchorCollection[0].getAttribute('href')
        })
    }

    async getImages(page: Page): Promise<string[] | null> {

        return await page.evaluate(() => {
            const readerArea = document.getElementById("readerarea");
            const imageParagraphs = readerArea.getElementsByTagName("p");
            return Array.from(imageParagraphs).map((imageParagraph: HTMLParagraphElement) => {
                const imageCollection = imageParagraph.getElementsByTagName("img");
                return imageCollection[0].src;
            })
        })
    }

    async goToNextPage(): Promise<void> {
        this.visitedLink[this.page.url()] = true;
        this.nextPageLink = await this.getNextPageLink(this.page);
        await this.page.goto(this.nextPageLink);
    }
    async scrap(): Promise<string[]> {
        const urls = [];

        this.nextPageLink = await this.getNextPageLink(this.page);

        do {
            console.log(this.nextPageLink);
            const images = await this.getImages(this.page);
            urls.push(...images);
            await this.goToNextPage();
        } while (!this.nextPageLink && Boolean(!this.visitedLink[this.nextPageLink]));

        return urls;
    }

}
