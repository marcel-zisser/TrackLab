import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  constructor(private readonly s3: S3Client) {}

  /**
   * Saves a file to persistent storage
   * @param file the file to save
   * @param bucket the bucket to put the object into
   * @param filename the filename of the file on the file system
   */
  async saveFile(file: Express.Multer.File, bucket: string, filename: string) {
    const key =
      filename + file.originalname.slice(file.originalname.lastIndexOf('.'));
    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const endpoint = await this.s3.config.endpoint();
    return `${endpoint.protocol}//${endpoint.hostname}:${endpoint.port}/${bucket}/${key}`;
  }
}
