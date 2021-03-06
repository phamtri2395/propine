import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { AWSModule } from '../aws';
import { PrismaModule } from '../prisma';
import { ProcessingModule } from '../processing';

@Module({
  imports: [ConfigModule, AWSModule, PrismaModule, ProcessingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
