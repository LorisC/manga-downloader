import {Page} from "puppeteer";

export type IMangaScrapper = {
    page: Page;
    visitedLink: {
        [key: string]: boolean;
    };
    imageLinks: string[];
    nextPageLink: string;
    getNextPageLink: (page: Page) => Promise<string | null>;
    scrap: () => Promise<string[] | null>
}
