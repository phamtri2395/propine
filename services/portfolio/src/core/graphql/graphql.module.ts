import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppConfig } from '@core/config';

export const GraphQLModule = NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
  inject: [AppConfig],
  driver: ApolloDriver,
  useFactory: async (appConfig: AppConfig) => {
    const { gqlModuleOptions } = appConfig;

    return gqlModuleOptions;
  },
});
