import { Module, Global } from '@nestjs/common';

import { AwsService } from './aws.service';

@Global()
@Module({
  imports: [],
  providers: [AwsService],
  exports: [AwsService],
})
export class AWSModule {}
