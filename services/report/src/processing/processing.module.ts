import { Module } from '@nestjs/common';

import { ProcessingService } from './processing.service';
import { ProcessingController } from './processing.controller';

@Module({
  imports: [],
  providers: [ProcessingService],
  controllers: [ProcessingController],
})
export class ProcessingModule {}
