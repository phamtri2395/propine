/* eslint-disable @typescript-eslint/no-explicit-any */

export enum LogLevel {
  LOG = 'LOG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  VERBOSE = 'VERBOSE',
}

export abstract class LoggerService {
  public abstract log(message: any, ...optionalParams: any[]): any;

  public abstract info(message: any, ...optionalParams: any[]): any;

  public abstract warn(message: any, ...optionalParams: any[]): any;

  public abstract error(message: any, ...optionalParams: any[]): any;

  public abstract debug(message: any, ...optionalParams: any[]): any;

  public abstract verbose(message: any, ...optionalParams: any[]): any;
}
