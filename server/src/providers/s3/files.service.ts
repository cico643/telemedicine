import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PublicFile from './publicFile.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import {
  AWS_ACCESS_KEY_ID,
  AWS_PUBLIC_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
} from '../../config';
import sharp from 'sharp';

@Injectable()
export class FilesService {
  private readonly s3: S3;
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private readonly logger: Logger,
  ) {
    this.s3 = new S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const uploadResult = await this.s3
      .upload({
        Bucket: AWS_PUBLIC_BUCKET_NAME,
        Body: await this.convertImageTypeToWebp(dataBuffer),
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    this.logger.debug(
      `Image uploaded to s3 [fileName: ${filename}]`,
      FilesService.name,
    );

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  async deletePublicFile(fileId: number) {
    const file = await this.publicFilesRepository.findOne({ id: fileId });
    await this.s3
      .deleteObject({
        Bucket: AWS_PUBLIC_BUCKET_NAME,
        Key: file.key,
      })
      .promise();
    await this.publicFilesRepository.delete(fileId);
  }

  private async convertImageTypeToWebp(buffer: Buffer): Promise<Buffer> {
    const buff = await sharp(buffer).webp({ lossless: true }).toBuffer();

    this.logger.debug('Image converted to webp', FilesService.name);

    return buff;
  }
}
