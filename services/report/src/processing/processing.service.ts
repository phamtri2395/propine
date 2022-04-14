import { Injectable, Logger } from '@nestjs/common';
import { parseStream } from 'fast-csv';
import ora from 'ora';

import { AppConfig } from '../config';
import { S3Service } from '../aws';

@Injectable()
export class ProcessingService {
  private readonly logger = new Logger(ProcessingService.name);

  constructor(private readonly appConfig: AppConfig, private readonly s3Service: S3Service) {}

  public async processReport(id: string): Promise<boolean> {
    const reportStream = this.s3Service
      .getInstance()
      .getObject({
        Bucket: this.appConfig.s3Bucket,
        Key: `${id}.csv`,
      })
      .createReadStream();

    let totalRowProcessed = 0;
    const spinner = ora('Processing report file...').start();

    return new Promise((resolve) => {
      parseStream(reportStream)
        .on('data', () => {
          totalRowProcessed += 1;
          spinner.text = `Processed ${totalRowProcessed} row(s)`;
        })
        .on('error', (error) => {
          this.logger.error(error);
          spinner.fail();

          resolve(false);
        })
        .on('end', (rowCount: number) => {
          this.logger.log(`Parsed ${rowCount} rows`);
          spinner.succeed();

          resolve(true);
        });
    });
  }
}
