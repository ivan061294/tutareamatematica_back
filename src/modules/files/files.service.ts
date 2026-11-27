import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly urlExpiration: number;
  private readonly s3Endpoint: string | undefined;

  constructor(private readonly config: ConfigService) {
    const endpoint = config.get<string>('aws.s3.endpoint');
    this.s3Endpoint = endpoint;
    this.s3 = new S3Client({
      region: config.get<string>('aws.region'),
      ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    });
    this.bucket = config.get<string>('aws.s3.bucket');
    this.urlExpiration = config.get<number>('aws.s3.urlExpiration');
  }

  async getPresignedUploadUrl(folder: string, contentType: string, originalName: string) {
    const ext = originalName.split('.').pop();
    const key = `${folder}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: this.urlExpiration });

    // LocalStack uses path-style URLs; AWS uses virtual-hosted style
    const publicUrl = this.s3Endpoint
      ? `${this.s3Endpoint}/${this.bucket}/${key}`
      : `https://${this.bucket}.s3.amazonaws.com/${key}`;

    return { uploadUrl: url, publicUrl, key };
  }

  async deleteFile(key: string) {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
