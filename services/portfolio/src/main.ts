import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from '@core/app';
import { AppConfig } from '@core/config';

const logger = new Logger('Bootstrap');

async function bootstrap(): Promise<void> {
  // create application instance
  const app = await NestFactory.create(AppModule);

  // get configurations
  const appConfig = app.get(AppConfig);
  const { env, host, port, isDevelopment, validationPipeOptions } = appConfig;

  logger.log(`Running on ${env} environment`);

  // security
  app.use(helmet());

  if (isDevelopment) {
    app.enableCors();

    // start listening for shutdown hooks
    app.enableShutdownHooks();
  }

  // bind validation globally
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  // start application
  await app.listen(port, host);
  const url = await app.getUrl();

  logger.log(`🚀 Application is up & running on ${url}`);

  if (isDevelopment) {
    logger.log(`🔥 GraphQL playground: ${url}/graphql`);
  }
}

bootstrap();
