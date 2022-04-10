import { ReadStream } from 'fs';

export interface UploadEngine {
  upload: (path: string, fileName: string) => Promise<boolean>;
  stream: (readStream: ReadStream, fileName: string) => Promise<boolean>;
}
