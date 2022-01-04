import { MigrationsRunner } from './migrations';
import { resolveConfig, ResolvedConfig } from './config';
import { Config } from '@tshio/elasticsearch-heaven-types';

export class Connection {
  private readonly config: ResolvedConfig;
  private readonly migrationsRunner: MigrationsRunner;

  protected constructor(config: ResolvedConfig) {
    this.config = config;

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

    await connection.migrationsRunner.init();

    return connection;
  }

  async runMigrations() {
    return this.migrationsRunner.up();
  }

  async rollbackMigrations(names: string[]) {
    return this.migrationsRunner.down(names);
  }
}
