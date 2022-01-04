import {
  Config,
  Logger,
  MigrationOptions,
  MigrationsLockStorage,
  MigrationsStorage,
} from '@tshio/elasticsearch-heaven-types';
import { EsMigrationLock, EsMigrationStorage } from '../migrations';
import { createConsoleLogger } from '../logger';
import { Client } from '@elastic/elasticsearch';

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
