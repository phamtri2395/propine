import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { AppConfig } from '../config';

@Injectable()
export class AwsService {
  public readonly s3Instance: S3;

  constructor(appConfig: AppConfig) {
    this.s3Instance = new S3(appConfig.s3Config);
  }
}
