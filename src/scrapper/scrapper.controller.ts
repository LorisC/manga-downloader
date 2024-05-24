import {Controller, Get,  Query, Res} from '@nestjs/common';
import {ASURA_SCANS, LEL_SCANS_NAME} from "./scrapper.factory";

@Controller('scrappers')
export class ScrapperController {
    constructor() {}

    @Get()
    async getAvailableProvider(): Promise<string[]> {
        return [LEL_SCANS_NAME, ASURA_SCANS]
    }
}
