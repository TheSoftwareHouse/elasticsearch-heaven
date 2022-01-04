import { MigrationOptions } from './migrations';
import { Client, ClientOptions } from '@elastic/elasticsearch';
import { Logger } from './logger';

interface BaseConfig {
  migrations: MigrationOptions;
  debug?: boolean;
  logger?: Logger;
}

export type Config =
  | (BaseConfig & {
      clientOptions: ClientOptions;
    })
  | (BaseConfig & { client: Client });
