import { GraphQLClient } from 'graphql-request';

import { Config } from '../common/config';

export const graphqlClient = new GraphQLClient(Config.portfolioEndpoint);
