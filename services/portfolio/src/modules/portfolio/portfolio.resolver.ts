import { Resolver, Query, Args } from '@nestjs/graphql';

import { Portfolio } from './portfolio.model';
import { FindAllByDateArgs, FindByTokenAndByDateArgs } from './portfolio.dto';
import { PortfolioService } from './portfolio.service';

@Resolver(() => Portfolio)
export class PortfolioResolver {
  constructor(private readonly service: PortfolioService) {}

  @Query(() => Boolean)
  public isIngesting(): Promise<boolean> {
    return this.service.getIngestionStatus();
  }

  @Query(() => [Portfolio])
  public latestPortfolios(): Promise<Portfolio[]> {
    return this.service.findAllLatest();
  }

  @Query(() => Portfolio)
  public latestPortfolio(@Args('token', { type: () => String }) token: string): Promise<Portfolio> {
    return this.service.findOneLatest(token);
  }

  @Query(() => [Portfolio])
  public portfoliosByDate(@Args() { date }: FindAllByDateArgs): Promise<Portfolio[]> {
    return this.service.findAllByDate(date);
  }

  @Query(() => Portfolio)
  public portfolioByDate(@Args() { token, date }: FindByTokenAndByDateArgs): Promise<Portfolio> {
    return this.service.findOneByDate(token, date);
  }
}
