import { registerEnumType } from '@nestjs/graphql';

export enum ENV {
  development = 'development',
  staging = 'staging',
  production = 'production',
}

registerEnumType(ENV, { name: 'ENV' });
