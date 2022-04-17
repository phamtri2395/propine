import { Command, Flags, CliUx } from '@oclif/core';
import { isMatch } from 'date-fns/fp';
import { map } from 'lodash/fp';

import { logger } from '../../common/logger';
import { prettyNum, prettyUsd } from '../../common/utils';
import {
  graphqlClient,
  Portfolio as PortfolioType,
  GET_INGESTION_STATUS,
  Get_Ingestion_StatusQuery,
  Get_Ingestion_StatusQueryVariables,
  GET_LATEST_PORTFOLIOS,
  Get_Latest_PortfoliosQuery,
  Get_Latest_PortfoliosQueryVariables,
  GET_LATEST_PORTFOLIO_OF_TOKEN,
  Get_Latest_Portfolio_Of_TokenQuery,
  Get_Latest_Portfolio_Of_TokenQueryVariables,
  GET_PORTFOLIOS_BY_DATE,
  Get_Portfolios_By_DateQuery,
  Get_Portfolios_By_DateQueryVariables,
  GET_PORTFOLIO_OF_TOKEN_BY_DATE,
  Get_Portfolio_Of_Token_By_DateQuery,
  Get_Portfolio_Of_Token_By_DateQueryVariables,
} from '../../graphql';
import { convertPortfolio } from '../../core/converter';

export default class Portfolio extends Command {
  public static description = 'Show investment portfolio';

  public static examples = [`$ propine portfolio -d 2019-10-25 -t BTC`];

  public static flags = {
    date: Flags.string({ char: 'd', description: 'Target date (yyyy-MM-dd)', required: false }),
    token: Flags.string({ char: 't', description: 'Token name', required: false }),
  };

  private static async printResult(portfolios: PortfolioType[]): Promise<void> {
    const convertedPortfolios = await Promise.all(map(convertPortfolio, portfolios));

    CliUx.ux.table(convertedPortfolios, {
      token: { minWidth: 8 },
      amount: {
        minWidth: 15,
        get: (row) => prettyNum(row.amount),
      },
      usd: {
        minWidth: 20,
        header: 'In USD',
        get: (row) => prettyUsd(row.usd),
      },
    });
  }

  public async run(): Promise<void> {
    const {
      flags: { token, date },
    } = await this.parse(Portfolio);

    if (date && !isMatch('yyyy-MM-dd', date)) throw new Error('date argument must be in yyyy-MM-dd format');

    const { isIngesting } = await graphqlClient.request<Get_Ingestion_StatusQuery, Get_Ingestion_StatusQueryVariables>(
      GET_INGESTION_STATUS
    );

    if (isIngesting) {
      logger.warn(`⚠️  We're still working on your report, any data you see here may not be up-to-date\n`);
    } else {
      logger.info(`✨  Your report was fully consumed\n`);
    }

    if (!token && !date) {
      const { latestPortfolios } = await graphqlClient.request<
        Get_Latest_PortfoliosQuery,
        Get_Latest_PortfoliosQueryVariables
      >(GET_LATEST_PORTFOLIOS);

      await Portfolio.printResult(latestPortfolios);

      return;
    }

    if (!date) {
      const { latestPortfolio } = await graphqlClient.request<
        Get_Latest_Portfolio_Of_TokenQuery,
        Get_Latest_Portfolio_Of_TokenQueryVariables
      >(GET_LATEST_PORTFOLIO_OF_TOKEN, { token });

      await Portfolio.printResult([latestPortfolio]);

      return;
    }

    if (!token) {
      const { portfoliosByDate } = await graphqlClient.request<
        Get_Portfolios_By_DateQuery,
        Get_Portfolios_By_DateQueryVariables
      >(GET_PORTFOLIOS_BY_DATE, { date });

      await Portfolio.printResult(portfoliosByDate);

      return;
    }

    const { portfolioByDate } = await graphqlClient.request<
      Get_Portfolio_Of_Token_By_DateQuery,
      Get_Portfolio_Of_Token_By_DateQueryVariables
    >(GET_PORTFOLIO_OF_TOKEN_BY_DATE, {
      token,
      date,
    });

    await Portfolio.printResult([portfolioByDate]);
  }
}
