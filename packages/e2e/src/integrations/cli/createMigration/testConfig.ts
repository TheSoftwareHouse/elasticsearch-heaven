import * as path from 'path';
import { Config } from '@elasticsearch-heaven/types';

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
