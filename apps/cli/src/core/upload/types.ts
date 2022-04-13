import { ReadStream, Stats } from 'fs';

export interface UploadEngine {
  upload: (path: string, name: string, stats: Stats) => Promise<boolean>;
  stream: (readStream: ReadStream, name: string, stats: Stats) => Promise<boolean>;
}
