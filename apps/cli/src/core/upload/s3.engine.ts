/* eslint-disable security/detect-non-literal-fs-filename */

import fs from 'fs-extra';
import AWS from 'aws-sdk';
import s3UploadStream from 's3-upload-stream';

import { Config, ENV } from '../../common/config';
import { UploadEngine } from './types';

export class S3Engine implements UploadEngine {
  private static instance: S3Engine;

  private readonly s3Instance: AWS.S3;

  private constructor(config: AWS.S3.ClientConfiguration) {
    this.s3Instance = new AWS.S3(config);
  }

  private async provisioning(): Promise<void> {
    if (Config.env === ENV.DEVELOPMENT) {
      await this.s3Instance.createBucket({ Bucket: Config.s3ReportBucket }).promise();
    }
  }

  public static getInstance(config: AWS.S3.ClientConfiguration = Config.s3DefaultConfig): S3Engine {
    if (!S3Engine.instance) S3Engine.instance = new S3Engine(config);

    return S3Engine.instance;
  }

  public async upload(path: string, fileName: string): Promise<boolean> {
    await this.provisioning();

    const file = await fs.readFile(path);

    return this.s3Instance
      .upload({
        Bucket: Config.s3ReportBucket,
        Key: fileName,
        Body: file,
      })
      .promise()
      .then(() => true)
      .catch(() => false);
  }

  public async stream(readStream: fs.ReadStream, fileName: string): Promise<boolean> {
    await this.provisioning();

    const s3Stream = s3UploadStream(this.s3Instance);

    const upload = s3Stream.upload({
      Bucket: Config.s3ReportBucket,
      Key: fileName,
    });

    readStream.pipe(upload);

    return new Promise((resolve) => {
      upload.on('error', () => resolve(false));
      upload.on('uploaded', () => resolve(true));
    });
  }
}
