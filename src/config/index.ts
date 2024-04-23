import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'dev') {
  dotenv.config({ path: './.env' });
}

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: './.env.test' });
}

const config: {
  port: number;
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  dbPort: number;
  nodeEnv: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsS3Region: string;
  bucketName: string;
  sessionSecret: string;
} = {
  port: Number(process.env.PORT) || 3000,
  dbHost: process.env.DB_HOST || '',
  dbUser: process.env.DB_USER || '',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || '',
  dbPort: Number(process.env.DB_PORT) || 3306,
  nodeEnv: process.env.NODE_ENV || 'development',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT) || 0,
  smtpUsername: process.env.SMTP_USERNAME || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsS3Region: process.env.AWS_S3_REGION || '',
  bucketName: process.env.BUCKET_NAME || '',
  sessionSecret: process.env.SESSION_SECRET || '',
};

export default config;
