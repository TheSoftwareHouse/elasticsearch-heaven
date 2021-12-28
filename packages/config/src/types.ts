import { Client, ClientOptions } from '@elasticsearch-heaven/client';
import { Logger } from '@elasticsearch-heaven/logger';
import { MigrationOptions } from '@elasticsearch-heaven/types';

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
