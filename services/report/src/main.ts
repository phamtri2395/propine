import { NestFactory } from '@nestjs/core';
import { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

import { AppModule } from './app';

let server: Handler;

const bootstrap = async (): Promise<Handler> => {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp });
};

export const handler: Handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());

  return server(event, context, callback);
};
