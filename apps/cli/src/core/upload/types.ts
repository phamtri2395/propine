import { ReadStream } from 'fs';

export interface UploadEngine {
  upload: (path: string) => Promise<boolean>;
  stream: (readStream: ReadStream) => Promise<boolean>;
}
