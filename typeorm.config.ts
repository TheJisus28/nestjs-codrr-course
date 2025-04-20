import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/dist/**/*.entity{.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
};

export default config;
