import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '../config';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: true,
  logging: true,
  entities: [join(__dirname, '../entities/**/*.ts')],
  migrations: [join(__dirname, '../migrations/**/*.ts')],
});
