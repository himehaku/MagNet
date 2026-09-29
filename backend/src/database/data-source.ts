import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../users/user.entity';

config({
  path: '../.env',
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [User],

  migrations: [
    __dirname + '/migrations/*{.ts,.js}',
    ],

  synchronize: false,
});