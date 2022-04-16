import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@propine/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  public async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Prisma connection established ✨');
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Prisma connection destroyed ✨');
  }
}
