import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import config from '../config/index.js';

class S3Service {
  constructor() {
    this.client = null;
    this.bucket = config.aws.s3Bucket;
    this._initialized = false;
  }

  _init() {
    if (this._initialized) return;
    if (!config.aws.accessKeyId || !config.aws.secretAccessKey || !config.aws.s3Bucket) {
      return; // S3 not configured - will use local fallback
    }
    this.client = new S3Client({
      region: config.aws.region || 'ap-south-1',
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
    this._initialized = true;
  }

  isConfigured() {
    this._init();
    return !!this.client;
  }

  /**
   * Upload a file buffer to S3
   * @returns {{ key: string, url: string }}
   */
  async uploadFile(fileBuffer, originalName, mimetype, folder = 'resumes') {
    this._init();

    const ext = originalName.split('.').pop();
    const uniqueName = `${folder}/${crypto.randomUUID()}.${ext}`;

    if (!this.client) {
      // Local fallback — return a mock URL for development without AWS
      console.warn('[S3] AWS not configured. Using local fallback.');
      return {
        key: uniqueName,
        url: `/uploads/${uniqueName}`,
        filename: originalName,
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: uniqueName,
      Body: fileBuffer,
      ContentType: mimetype,
      Metadata: {
        originalName,
      },
    });

    await this.client.send(command);

    return {
      key: uniqueName,
      url: `https://${this.bucket}.s3.${config.aws.region}.amazonaws.com/${uniqueName}`,
      filename: originalName,
    };
  }

  /**
   * Generate a signed URL for secure file access
   */
  async getSignedUrl(key, expiresIn = 3600) {
    this._init();

    if (!this.client) {
      return `/uploads/${key}`;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key) {
    this._init();

    if (!this.client) return;

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }
}

export default new S3Service();
