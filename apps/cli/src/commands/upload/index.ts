import { Command } from '@oclif/core';
import fetch from 'node-fetch';

import { logger } from '../../common/logger';
import { Config } from '../../common/config';
import { UploadManager, S3Engine } from '../../core/upload';

interface Args {
  filePath: string;
}

export default class UploadReport extends Command {
  public static description = 'Upload transaction report file';

  public static examples = [`$ propine upload /usr/reports/transactions.csv`];

  public static args = [{ name: 'filePath', description: 'Absolute path to the report file', required: true }];

  public async run(): Promise<void> {
    const {
      args: { filePath },
    } = await this.parse<Record<string, never>, Args>(UploadReport);

    logger.info(`Uploading ${filePath}...`);

    const timestamp = Date.now();
    const fileName = `${timestamp}.csv`;
    const uploadManager = new UploadManager(S3Engine.getInstance());

    const success = await uploadManager.upload(filePath, fileName);

    if (!success) {
      logger.error('Something went wrong while uploading report file 😞');
      return;
    }

    // FIXME: just for demo purpose
    await fetch(`${Config.lambdaReportProcessingEndpoint}/${timestamp}`, { method: 'POST', timeout: 1000 }).catch(
      () => null
    );

    logger.info(
      'Upload report file successfully ✨. Now let try to get some of your transaction data by running: propine portfolio'
    );
  }
}
