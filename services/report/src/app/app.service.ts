import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public processReport(): string {
    return 'Processing report file...';
  }
}
