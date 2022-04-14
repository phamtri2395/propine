import { Module, Global } from '@nestjs/common';

import { S3Service } from './s3.service';

@Global()
@Module({
  imports: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class AWSModule {}
