import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { AWSModule } from '../aws';
import { ProcessingModule } from '../processing';

@Module({
  imports: [ConfigModule, AWSModule, ProcessingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
