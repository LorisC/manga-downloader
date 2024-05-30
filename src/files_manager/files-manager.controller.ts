import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common';
import { FilesManagerService } from './files-manager.service';
import { Response } from 'express';
import { join } from 'path';

@Controller('files')
export class FilesManagerController {
  constructor(private fileManagerService:FilesManagerService) {}

  @Get('info/:id')
  info(@Param() params: any){
    const info = this.fileManagerService.info(params.id);

    if (info) return info;

    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Get('acknowledge/:id')
  acknowledge(@Param() params: any){
    const info = this.fileManagerService.acknowledge(params.id);

    if (info) return info;

    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }


  @Get(':fileName')
  async getFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = join(  'public', fileName);
    res.send({path: filePath});
  }
}
