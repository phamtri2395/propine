import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { AppConfig } from '../config';

@Injectable()
export class S3Service {
  private readonly s3Service: S3;

  constructor(appConfig: AppConfig) {
    console.log('S3 service constructor');

    this.s3Service = new S3(appConfig.s3Config);
  }

  public getInstance(): S3 {
    return this.s3Service;
  }
}
