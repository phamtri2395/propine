import { Command, Flags } from '@oclif/core';

export default class Portfolio extends Command {
  public static description = 'Show investment portfolio';

  public static examples = [`$ propine portfolio -d 21/12/2021 -t BTC`];

  public static flags = {
    date: Flags.string({ char: 'd', description: 'Target date', required: false }),
    token: Flags.string({ char: 't', description: 'Token name', required: false }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Portfolio);

    this.log(`Showing portfolio for ${flags.token} on ${flags.date}`);
  }
}
