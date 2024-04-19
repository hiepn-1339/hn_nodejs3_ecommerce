import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

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
};

export default config;
