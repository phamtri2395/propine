import { Command } from '@oclif/core';

import { logger } from '../../common/logger';
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

    const fileName = `${Date.now()}.csv`;
    const uploadManager = new UploadManager(S3Engine.getInstance());

    const success = await uploadManager.upload(filePath, fileName);

    if (!success) {
      logger.error('Something went wrong while uploading report file 😞');
      return;
    }

    logger.info(
      'Upload report file success ✨. Now let try to get some of your transaction data by running: propine portfolio'
    );
  }
}
