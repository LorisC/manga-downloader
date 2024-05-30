import {Module} from '@nestjs/common';
import { FilesManagerService } from './files-manager.service';
import { FilesManagerController } from './files-manager.controller';


@Module({
  providers: [FilesManagerService],
  controllers: [FilesManagerController],

})
export class FilesManagerModule {
}
