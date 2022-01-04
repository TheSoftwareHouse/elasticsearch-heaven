import { MigrationsRunner } from './migrations';
import { resolveConfig, ResolvedConfig } from './config';
import { Config, Logger } from '@tshio/elasticsearch-heaven-types';
import { Client } from '@elastic/elasticsearch';
import { waitForConnection } from './client/waitForConnection';

export class Connection {
  private readonly config: ResolvedConfig;
  private readonly migrationsRunner: MigrationsRunner;
  private readonly logger: Logger;
  private readonly client: Client;

  private isConnected = false;

  protected constructor(config: ResolvedConfig) {
    this.config = config;
    this.logger = config.logger;
    this.client = config.client;

    this.migrationsRunner = new MigrationsRunner({
      migrations: config.migrations.migrations,
      migrationsContext: config.migrations.migrationsContext,
      migrationsStorage: config.migrations.migrationsStorage,
      client: config.client,
      logger: config.logger,
      migrationsLock: config.migrations.lock,
    });
  }

  static async create(config: Config) {
    const resolvedConfig = await resolveConfig(config);

    const connection = new Connection(resolvedConfig);

    await connection.waitForElasticsearch();

    await connection.migrationsRunner.init();

    return connection;
  }

  async runMigrations() {
    return this.migrationsRunner.up();
  }

  async rollbackMigrations(names: string[]) {
    return this.migrationsRunner.down(names);
  }

  async waitForElasticsearch() {
    if (this.isConnected) {
      return;
    }

    this.isConnected = await waitForConnection(this.client, this.logger);
  }
}
