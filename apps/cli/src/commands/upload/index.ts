import { Command } from '@oclif/core';

export default class UploadReport extends Command {
  public static description = 'Upload transaction report file';

  public static examples = [`$ propine upload /usr/reports/transactions.csv`];

  public static args = [{ name: 'filePath', description: 'Absolute path to the report file', required: true }];

  public async run(): Promise<void> {
    const { args } = await this.parse(UploadReport);

    this.log(`Upload ${args.filePath}`);
  }
}
