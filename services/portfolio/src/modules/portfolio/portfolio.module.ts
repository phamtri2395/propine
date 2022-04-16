import { Module } from '@nestjs/common';

import { PortfolioService } from './portfolio.service';
import { PortfolioResolver } from './portfolio.resolver';

@Module({
  imports: [],
  providers: [PortfolioService, PortfolioResolver],
  controllers: [],
})
export class PortfolioModule {}
