import { Config } from '@elasticsearch-heaven/config';
import * as path from 'path';

export default {
  clientOptions: {
    node: 'http://localhost:9200',
  },
  migrations: {
    migrationsDir: path.resolve(__dirname, './migrations'),
    migrationFileExt: 'ts',
    migrations: [],
  },
} as Config;
