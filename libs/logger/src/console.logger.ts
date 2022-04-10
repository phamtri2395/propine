/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

import chalk, { Chalk } from 'chalk';

import { LoggerService, LogLevel } from './types';

const Theme: Record<LogLevel, Chalk> = {
  [LogLevel.LOG]: chalk.white,
  [LogLevel.INFO]: chalk.blueBright,
  [LogLevel.WARN]: chalk.yellow,
  [LogLevel.ERROR]: chalk.red,
  [LogLevel.DEBUG]: chalk.blue,
  [LogLevel.VERBOSE]: chalk.gray,
};

export class ConsoleLogger extends LoggerService {
  public log(message: any): void {
    const theme = Theme[LogLevel.LOG];

    console.log(theme(message));
  }

  public info(message: any): void {
    const theme = Theme[LogLevel.INFO];

    console.log(theme(message));
  }

  public warn(message: any): void {
    const theme = Theme[LogLevel.WARN];

    console.log(theme(message));
  }

  public error(message: any): void {
    const theme = Theme[LogLevel.ERROR];

    console.log(theme(message));
  }

  public debug(message: any): void {
    const theme = Theme[LogLevel.DEBUG];

    console.log(theme(message));
  }

  public verbose(message: any): void {
    const theme = Theme[LogLevel.VERBOSE];

    console.log(theme(message));
  }
}
