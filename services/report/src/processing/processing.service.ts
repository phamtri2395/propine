import { Injectable, Logger } from '@nestjs/common';
import { Prisma, TransactionType, Metadata } from '@prisma/client';
import { CsvParserStream, parseStream } from 'fast-csv';
import { toInteger, toFinite } from 'lodash/fp';
import ora from 'ora';

import { AppConfig } from '../config';
import { AwsService } from '../aws';
import { PrismaService } from '../prisma';
import { CsvTransactionRow, TransformedTransactionRow } from './types';

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
        amount: toFinite(row.token),
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

  private updateMetadata(payload: Prisma.MetadataUpdateInput): Promise<Metadata> {
    return this.prisma.metadata.update({
      where: {},
      data: payload,
    });
  }

  public async processReport(id: string): Promise<boolean> {
    const spinner = ora('Processing report file...').start();
    const startTime = Date.now();

    await this.dbCleanup();
    const metadata = await this.getMetadata();

    const reportProcessingStream = this.getReportStream(id);
    let { latestTransactionAt } = metadata;
    let buffer: Prisma.TransactionCreateInput[] = [];
    let totalRowProcessed = 0;

    return new Promise((resolve) => {
      reportProcessingStream
        .on('data', async (row: TransformedTransactionRow) => {
          if (latestTransactionAt < row.timestamp) {
            latestTransactionAt = row.timestamp;
          }

          buffer.push(row);

          if (buffer.length >= ProcessingService.PROCESSING_BUFFER_LIMIT) {
            reportProcessingStream.pause();

            await this.prisma.transaction.createMany({
              data: buffer,
            });
            await this.updateMetadata({ latestTransactionAt });

            buffer = [];

            reportProcessingStream.resume();
          }

          totalRowProcessed += 1;
          const endTime = Date.now();

          spinner.text = `Processed ${totalRowProcessed} row(s) - Elapsed time: ${(endTime - startTime) / 1000} s`;
        })
        .on('error', async (error) => {
          this.logger.error(error);
          spinner.fail();

          await this.updateMetadata({ isReportIngesting: false, latestTransactionAt });

          resolve(false);
        })
        .on('end', async (rowCount: number) => {
          this.logger.log(`Parsed ${rowCount} rows`);
          spinner.succeed();

          await this.updateMetadata({ isReportIngesting: false, latestTransactionAt });

          resolve(true);
        });
    });
  }
}
