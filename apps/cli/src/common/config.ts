import { S3 } from 'aws-sdk';

export enum ENV {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export class Config {
  private constructor() {}

  public static get env(): ENV {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (<any>ENV)[process.env.NODE_ENV] ?? ENV.DEVELOPMENT;
  }

  public static get s3DefaultConfig(): S3.ClientConfiguration {
    return {
      endpoint: process.env.AWS_S3_ENDPOINT ?? 'http://localhost:4566',
      s3ForcePathStyle: Config.env === ENV.DEVELOPMENT,
    };
  }

  public static get s3ReportBucket(): string {
    return process.env.AWS_S3_REPORT_BUCKET ?? 'reports';
  }

  public static get lambdaReportProcessingEndpoint(): string {
    return process.env.LAMBDA_REPORT_PROCESSING_ENDPOINT ?? 'http://localhost:50003/dev/process-report';
  }

  public static get portfolioEndpoint(): string {
    return process.env.PORTFOLIO_ENDPOINT ?? 'http://localhost:50002/graphql';
  }

  public static get cryptoCompareEndpoint(): string {
    return process.env.CRYPTO_COMPARE_ENDPOINT ?? 'https://min-api.cryptocompare.com/data/price';
  }
}
