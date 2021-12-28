import { Config } from './types';
import {
  EsMigrationLock,
  EsMigrationStorage,
} from '@elasticsearch-heaven/migrations';
import { createConsoleLogger, Logger } from '@elasticsearch-heaven/logger';
import { Client } from '@elasticsearch-heaven/client';
import {
  MigrationOptions,
  MigrationsLockStorage,
  MigrationsStorage,
} from '@elasticsearch-heaven/types';

export interface ResolvedConfig extends Pick<Config, 'debug'> {
  logger: Logger;
  client: Client;
  migrations: MigrationOptions & {
    migrationsStorage: MigrationsStorage;
    lock: MigrationsLockStorage;
  };
}

export const resolveConfig = (config: Config): ResolvedConfig => {
  const logger = config.logger ?? createConsoleLogger(config.debug);

  const client =
    'client' in config ? config.client : new Client(config.clientOptions);

  return {
    ...config,
    logger,
    client,
    migrations: resolveMigrations(config.migrations, client, logger),
  };
};

const resolveMigrations = (
  config: MigrationOptions,
  client: Client,
  logger: Logger
): ResolvedConfig['migrations'] => {
  return {
    ...config,
    migrationsStorage:
      'migrationsStorage' in config
        ? config.migrationsStorage
        : new EsMigrationStorage(
            config.migrationsIndexName ?? 'migrations',
            client,
            logger
          ),
    lock:
      'lock' in config
        ? config.lock
        : new EsMigrationLock(
            config.lockIndexName ?? 'migrations_lock',
            client,
            logger
          ),
  };
};
