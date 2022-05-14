import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { MAX_FILE_SIZE } from 'src/config/constants';

export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};
