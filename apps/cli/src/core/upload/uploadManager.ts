/* eslint-disable security/detect-non-literal-fs-filename */

import { extname, basename } from 'path';
import fs from 'fs-extra';
import { __, includes, lte } from 'lodash/fp';

import { UploadEngine } from './types';

const ALLOWED_EXTENSIONS = ['.csv'];
const MAX_SIZE_ALLOWED = 1610612736; // in bytes - 1.5GB
const TWENTY_MEGABYTES = 20971520; // in bytes

const isExtensionAllowed = includes(__, ALLOWED_EXTENSIONS);
const isSizeAllowed = lte(__, MAX_SIZE_ALLOWED);
const isSizeLessOrEqualThan20MB = lte(__, TWENTY_MEGABYTES);

export class UploadManager {
  constructor(private uploadEngine: UploadEngine) {}

  public static async validateFile(path: string): Promise<[valid: boolean, stats: fs.Stats]> {
    const isFileExists = await fs.pathExists(path);
    if (!isFileExists) return [false, null];

    const extension = extname(path);
    if (!isExtensionAllowed(extension)) return [false, null];

    const stats = await fs.stat(path);
    if (!isSizeAllowed(stats.size)) return [false, null];

    return [true, stats];
  }

  public setEngine(uploadEngine: UploadEngine): void {
    this.uploadEngine = uploadEngine;
  }

  public async upload(path: string, overriddenFileName?: string): Promise<boolean> {
    const [isFileValid, fileStats] = await UploadManager.validateFile(path);

    if (!isFileValid) return false;

    const fileName = overriddenFileName ?? basename(path);

    if (isSizeLessOrEqualThan20MB(fileStats.size)) return this.uploadEngine.upload(path, fileName, fileStats);

    const readStream = fs.createReadStream(path);

    return this.uploadEngine.stream(readStream, fileName, fileStats);
  }
}
