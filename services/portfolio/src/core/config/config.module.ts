import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { app, AppConfig } from './app.config';

const configurations = () =>
  <const>{
    app: app(),
  };

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configurations],
    }),
  ],
  providers: [AppConfig],
  exports: [AppConfig],
})
export class ConfigModule {}
