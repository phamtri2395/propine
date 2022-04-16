import { Injectable, Logger } from '@nestjs/common';
import { Prisma, TransactionType, Metadata, LatestPortfolio } from '@prisma/client';
import { CsvParserStream, parseStream } from 'fast-csv';
import { map, toInteger, toFinite } from 'lodash/fp';
import ora from 'ora';

import { AppConfig } from '../config';
import { AwsService } from '../aws';
import { PrismaService } from '../prisma';
import { CsvTransactionRow, TransformedTransactionRow, Portfolio } from './types';

@Injectable()
export class ProcessingService {
  private static readonly PROCESSING_BUFFER_LIMIT = 200000;

  private readonly logger = new Logger(ProcessingService.name);

  constructor(
    private readonly appConfig: AppConfig,
    private readonly awsService: AwsService,
    private readonly prisma: PrismaService
  ) {}

  // FIXME: this is just for demo purpose
  private async dbCleanup(): Promise<void> {
    await Promise.all([this.prisma.metadata.deleteMany(), this.prisma.transaction.deleteMany()]);
  }

  private getReportStream(id: string): CsvParserStream<CsvTransactionRow, TransformedTransactionRow> {
    const s3ReadStream = this.awsService.s3Instance
      .getObject({
        Bucket: this.appConfig.s3Bucket,
        Key: `${id}.csv`,
      })
      .createReadStream();

    return parseStream<CsvTransactionRow, TransformedTransactionRow>(s3ReadStream, { headers: true }).transform(
      (row: CsvTransactionRow): TransformedTransactionRow => ({
        timestamp: new Date(toInteger(row.timestamp) * 1000),
        transactionType: <TransactionType>row.transaction_type,
        token: row.token,
        amount: toFinite(row.amount),
      })
    );
  }

  private async getMetadata(): Promise<Metadata> {
    const metadata = await this.prisma.metadata.findFirst();

    if (metadata) return metadata;

    return this.prisma.metadata.create({
      data: {
        latestTransactionAt: null,
        isReportIngesting: false,
      },
    });
  }

  private updateMetadata(id: number, payload: Prisma.MetadataUpdateInput): Promise<Metadata> {
    return this.prisma.metadata.update({
      where: {
        id,
      },
      data: payload,
    });
  }

  private static getLatestPortfolio(
    { transactionType, token, amount }: TransformedTransactionRow,
    currentPortfolio: Record<string, Portfolio>
  ): Record<string, Portfolio> {
    // eslint-disable-next-line security/detect-object-injection
    const currentTokenPortfolio = currentPortfolio[token];
    const addedAmount = transactionType === TransactionType.DEPOSIT ? amount : -amount;

    if (!currentTokenPortfolio)
      return {
        ...currentPortfolio,
        [token]: {
          token,
          amount,
        },
      };

    return {
      ...currentPortfolio,
      [token]: {
        ...currentTokenPortfolio,
        amount: currentTokenPortfolio.amount + addedAmount,
      },
    };
  }

  private async persistLatestPortfolio(portfolio: Record<string, Portfolio>): Promise<LatestPortfolio[]> {
    return Promise.all(
      map(
        ({ token, amount }) =>
          this.prisma.latestPortfolio.upsert({
            where: { token },
            create: { token, amount },
            update: { amount },
          }),
        portfolio
      )
    );
  }

  public async processReport(id: string): Promise<boolean> {
    const spinner = ora('Processing report file...').start();
    const startTime = Date.now();

    await this.dbCleanup();
    const metadata = await this.getMetadata();

    const reportProcessingStream = this.getReportStream(id);
    let { latestTransactionAt } = metadata;
    let buffer: Prisma.TransactionCreateInput[] = [];
    let latestPortfolio: Record<string, Portfolio> = {};
    let totalRowProcessed = 0;

    const persistTransactions = async (): Promise<void> => {
      if (buffer.length) {
        reportProcessingStream.pause();

        await this.prisma.transaction.createMany({
          data: buffer,
        });

        await Promise.all([
          this.updateMetadata(metadata.id, { latestTransactionAt }),
          this.persistLatestPortfolio(latestPortfolio),
        ]);

        buffer = [];

        reportProcessingStream.resume();
      }
    };

    return new Promise((resolve) => {
      reportProcessingStream
        .on('data', async (row: TransformedTransactionRow) => {
          if (latestTransactionAt < row.timestamp) {
            latestTransactionAt = row.timestamp;
          }

          buffer.push(row);

          latestPortfolio = ProcessingService.getLatestPortfolio(row, latestPortfolio);

          if (buffer.length >= ProcessingService.PROCESSING_BUFFER_LIMIT) await persistTransactions();

          totalRowProcessed += 1;
          const endTime = Date.now();

          spinner.text = `Processed ${totalRowProcessed} row(s) - Elapsed time: ${(endTime - startTime) / 1000} s`;
        })
        .on('error', async (error) => {
          this.logger.error(error);
          spinner.fail();

          await this.updateMetadata(metadata.id, { isReportIngesting: false, latestTransactionAt });

          resolve(false);
        })
        .on('end', async (rowCount: number) => {
          await persistTransactions();

          this.logger.log(`Parsed ${rowCount} rows`);
          spinner.succeed();

          await this.updateMetadata(metadata.id, { isReportIngesting: false, latestTransactionAt });

          resolve(true);
        });
    });
  }
}
