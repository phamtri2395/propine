import { ApolloClient, InMemoryCache } from '@apollo/client';

import { Config } from '../common/config';

export const apolloClient = new ApolloClient({
  uri: Config.portfolioEndpoint,
  cache: new InMemoryCache(),
});
