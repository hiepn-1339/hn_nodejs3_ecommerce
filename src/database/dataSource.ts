import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '../config';
import { join } from 'path';
import { initializeTransactionalContext, addTransactionalDataSource, StorageDriver } from 'typeorm-transactional';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: false,
  logging: false,
  entities: [join(__dirname, '../entities/**/*.ts')],
  migrations: [join(__dirname, '../migrations/**/*.ts')],
});

initializeTransactionalContext({ storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE });
addTransactionalDataSource(AppDataSource);
