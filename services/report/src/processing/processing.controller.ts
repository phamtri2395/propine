import { Controller, Post, Param } from '@nestjs/common';

import { ProcessingService } from './processing.service';

@Controller('process-report')
export class ProcessingController {
  constructor(private readonly processingService: ProcessingService) {}

  @Post(':id')
  public processReport(@Param('id') id: string): Promise<boolean> {
    return this.processingService.processReport(id);
  }
}
