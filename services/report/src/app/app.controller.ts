import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('uploadReport')
  @UseInterceptors(FileInterceptor('file'))
  public uploadReport(@UploadedFile() file: Express.Multer.File): string {
    console.log('file', file);

    return this.appService.processReport();
  }
}
