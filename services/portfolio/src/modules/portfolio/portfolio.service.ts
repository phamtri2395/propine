import { Injectable } from '@nestjs/common';
import { TransactionType } from '@propine/prisma';
import { addDays, parseISO } from 'date-fns/fp';
import { sum, toUpper, values } from 'lodash/fp';

import { PrismaService } from '@core/prisma';

import { Portfolio } from './portfolio.model';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  public findAllLatest(): Promise<Portfolio[]> {
    return this.prisma.latestPortfolio.findMany();
  }

  public findOneLatest(token: string): Promise<Portfolio> {
    return this.prisma.latestPortfolio.findUnique({ where: { token } });
  }

  public async findAllByDate(date: string): Promise<Portfolio[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        timestamp: {
          gte: parseISO(date),
          lt: addDays(1, parseISO(date)),
        },
      },
    });

    const portfolios = transactions.reduce<Record<string, Portfolio>>((prevValue, currValue) => {
      const { token, transactionType } = currValue;
      const amount = transactionType === TransactionType.DEPOSIT ? currValue.amount : -currValue.amount;

      // eslint-disable-next-line security/detect-object-injection
      const tokenPortfolio = prevValue[token];

      if (!tokenPortfolio) return { ...prevValue, [token]: { token, amount } };

      return {
        ...prevValue,
        [token]: {
          ...tokenPortfolio,
          amount: tokenPortfolio.amount + amount,
        },
      };
    }, {});

    return values(portfolios);
  }

  public async findOneByDate(token: string, date: string): Promise<Portfolio> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        token: toUpper(token),
        timestamp: {
          gte: parseISO(date),
          lt: addDays(1, parseISO(date)),
        },
      },
    });

    const totalAmount = sum(
      transactions.map(({ transactionType, amount }) =>
        transactionType === TransactionType.DEPOSIT ? amount : -amount
      )
    );

    return {
      token,
      amount: totalAmount,
    };
  }
}
