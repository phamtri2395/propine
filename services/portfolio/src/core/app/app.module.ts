import { Module } from '@nestjs/common';

import { ConfigModule } from '@core/config';
import { GraphQLModule } from '@core/graphql';
import { PrismaModule } from '@core/prisma';

import { PortfolioModule } from '@modules/portfolio';

@Module({
  imports: [ConfigModule, GraphQLModule, PrismaModule, PortfolioModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
