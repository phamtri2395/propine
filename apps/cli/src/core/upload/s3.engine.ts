/* eslint-disable security/detect-non-literal-fs-filename */

import fs from 'fs-extra';
import AWS from 'aws-sdk';
import s3UploadStream from 's3-upload-stream';

import { UploadEngine } from './types';

export class S3Engine implements UploadEngine {
  private static instance: S3Engine;

  private readonly s3Instance: AWS.S3;

  private constructor(config: AWS.S3.ClientConfiguration) {
    this.s3Instance = new AWS.S3(config);
  }

  public static getInstance(
    config: AWS.S3.ClientConfiguration = { endpoint: 'http://localhost:4566', s3ForcePathStyle: true }
  ): S3Engine {
    if (!S3Engine.instance) S3Engine.instance = new S3Engine(config);

    return S3Engine.instance;
  }

  public async upload(path: string): Promise<boolean> {
    const file = await fs.readFile(path);

    return this.s3Instance
      .upload({
        Bucket: 'test',
        Key: 'key-name',
        Body: file,
      })
      .promise()
      .then(() => true)
      .catch(() => false);
  }

  public async stream(readStream: fs.ReadStream): Promise<boolean> {
    const s3Stream = s3UploadStream(this.s3Instance);

    const upload = s3Stream.upload({
      Bucket: 'test',
      Key: 'key-name',
    });

    readStream.pipe(upload);

    return new Promise((resolve) => {
      upload.on('error', () => resolve(false));
      upload.on('uploaded', () => resolve(true));
    });
  }
}
