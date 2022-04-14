import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

import { ENV } from './types';

export const app = () =>
  <const>{
    env: process.env.NODE_ENV || ENV.DEVELOPMENT,
    awsS3Endpoint: process.env.AWS_S3_ENDPOINT || 'http://localhost:4566',
    awsS3Bucket: process.env.AWS_S3_BUCKET || 'reports',
  };

@Injectable()
export class AppConfig {
  private readonly appConfig: ReturnType<typeof app>;

  constructor(private readonly config: ConfigService) {
    this.appConfig = this.config.get('app');
  }

  public get env(): ENV {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (<any>ENV)[this.appConfig.env] || ENV.DEVELOPMENT;
  }

  public get s3Config(): S3.ClientConfiguration {
    return {
      endpoint: this.appConfig.awsS3Endpoint,
      s3ForcePathStyle: this.env === ENV.DEVELOPMENT,
    };
  }

  public get s3Bucket(): string {
    return this.appConfig.awsS3Bucket;
  }
}
