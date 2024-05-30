import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import randomUseragent from 'random-useragent';

puppeteer.use(StealthPlugin());


export class CustomBrowser {
    private static browser: Browser | null = null;
    static async getPage(url: string): Promise<Page> {

        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true, // Sometimes running in headless mode can trigger bot detection
                args: [
                    "--disable-dev-shm-usage",
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                ],
            });
        }

        const page: Page = await this.browser.newPage();
        const userAgent = randomUseragent.getRandom();
        await page.setUserAgent(userAgent);
        await page.goto(url, { waitUntil: 'networkidle2' });
        return page;
    }


    static async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
