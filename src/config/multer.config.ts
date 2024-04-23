import multerS3 from 'multer-s3';
import config from '.';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
  region: config.awsS3Region,
});

export const s3Storage = multerS3({
  s3: s3,
  bucket: config.bucketName,
  metadata: (req, file, cb) => {
    cb(null, {fieldname: file.fieldname});
  },
  key: (req, file, cb) => {
    const id = uuidv4(); 
    const fileName = `${id}_${Date.now()}_${file.fieldname}_${file.originalname}`;
    cb(null, fileName);
  },
});
