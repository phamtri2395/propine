import { Injectable, ValidationPipeOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApolloDriverConfig } from '@nestjs/apollo';

import { ENV } from '@common/types';

export const app = () =>
  <const>{
    env: process.env.NODE_ENV || ENV.development,
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || '50002',
  };

@Injectable()
export class AppConfig {
  private readonly appConfig: ReturnType<typeof app>;

  constructor(private readonly config: ConfigService) {
    this.appConfig = this.config.get('app');
  }

  public get env(): ENV {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (<any>ENV)[this.appConfig.env] || ENV.development;
  }

  public get host(): string {
    return this.appConfig.host;
  }

  public get port(): number {
    return parseInt(this.appConfig.port, 10);
  }

  public get isDevelopment(): boolean {
    return this.env === ENV.development;
  }

  public get validationPipeOptions(): ValidationPipeOptions {
    return {
      disableErrorMessages: !this.isDevelopment,
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: false,
    };
  }

  public get gqlModuleOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      debug: this.isDevelopment,
      playground: this.isDevelopment,
    };
  }
}
