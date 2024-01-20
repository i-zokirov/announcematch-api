import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import sharp from 'sharp';

@Injectable()
export class CloudinaryService {
  async uploadImageFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      const resizedImage = await sharp(file.buffer)
        .resize({
          width: parseInt(process.env.MAX_IMAGE_WIDTH) || 400,
          height: parseInt(process.env.MAX_IMAGE_HEIGHT) || 400,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'auto',
              overwrite: true,
              folder,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(resizedImage);
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error uploading image');
    }
  }

  deleteAssetById(assetId: string) {
    return cloudinary.uploader.destroy(assetId);
  }
}
