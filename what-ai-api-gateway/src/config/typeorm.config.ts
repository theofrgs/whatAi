import * as path from 'path';
import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export default registerAs(
  'database',
  (): DataSourceOptions =>
    process.env.NODE_ENV && process.env.NODE_ENV === 'test'
      ? {
          type: 'sqlite',
          database: ':memory:',
          entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
          synchronize: true,
          logging: false,
        }
      : {
          type: 'mariadb',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_INIT_ROOT_USER,
          password: process.env.DB_INIT_ROOT_PASSWORD,
          database: process.env.DB_NAME,
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // entities: [_i_dirname + '/../**/*.entity{.ts,.js}'],
          entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
          migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],
          synchronize: true,
        },
);
