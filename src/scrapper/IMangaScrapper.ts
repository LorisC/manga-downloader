import {Page} from "puppeteer";
import {Job} from "bull";

export type IMangaScrapper = {
    page: Page;
    visitedLink: {
        [key: string]: boolean;
    };
    imageLinks: string[];
    nextPageLink: string;
    getNextPageLink: (page: Page) => Promise<string | null>;
    scrap: (job: Job) => Promise<string[] | null>
}
