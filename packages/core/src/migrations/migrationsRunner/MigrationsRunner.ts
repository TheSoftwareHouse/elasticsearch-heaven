import { resolveMigrations } from '../resolveMigrations';
import {
  Logger,
  MigrationOptions,
  MigrationsLockStorage,
  MigrationsStorage,
  NamedMigration,
} from '@elasticsearch-heaven/types';
import { v4 } from 'uuid';
import { Client } from '@elastic/elasticsearch';

export interface MigrationsRunnerDependencies
  extends Pick<MigrationOptions, 'migrations' | 'migrationsContext'> {
  client: Client;
  migrationsStorage: MigrationsStorage;
  migrationsLock: MigrationsLockStorage;
  logger: Logger;
}

export class MigrationsRunner {
  private migrations: NamedMigration[] = [];

  private readonly logger: Logger;

  constructor(private readonly dependencies: MigrationsRunnerDependencies) {
    this.logger = dependencies.logger.createScope('Migrations');
  }

  async init() {
    this.migrations = await resolveMigrations(this.dependencies.migrations);
  }

  private async acquireLock() {
    const lock = await this.dependencies.migrationsLock.acquireLock();

    if (!lock) {
      this.logger.info('Migrations are already running');
    }

    return lock;
  }

  async up(): Promise<number> {
    let migrationsCount = 0;

    if (!(await this.acquireLock())) {
      return migrationsCount;
    }

    try {
      const currentMigrations =
        await this.dependencies.migrationsStorage.read();

      const migrationsToRun = this.migrations.filter(
        (migration) =>
          !currentMigrations.find(
            (currentMigration) => currentMigration.name === migration.name
          )
      );

      if (!migrationsToRun.length) {
        this.logger.info('No migrations to run');

        return migrationsCount;
      }

      this.logger.info(`Running ${migrationsToRun.length} migrations`);

      for (const migration of migrationsToRun) {
        this.logger.info(`Running migration ${migration.name}`);

        await migration.up({
          client: this.dependencies.client,
          context: this.dependencies.migrationsContext,
        });

        await this.dependencies.migrationsStorage.write([
          {
            id: v4(),
            name: migration.name,
            timestamp: new Date(),
          },
        ]);

        migrationsCount++;
      }

      this.logger.success('Migrations completed');

      return migrationsCount;
    } finally {
      await this.dependencies.migrationsLock.releaseLock();
    }
  }

  async down(migrationNames: string[]) {
    let rollbackedMigrations = 0;

    if (!(await this.acquireLock())) {
      return rollbackedMigrations;
    }

    try {
      const migrationsToDown = this.migrations.filter((migration) =>
        migrationNames.includes(migration.name)
      );

      if (!migrationsToDown.length) {
        this.logger.info('No migrations to rollback found.');

        return rollbackedMigrations;
      }

      this.logger.info(`Rolling back ${migrationsToDown.length} migrations`);

      for (const migration of migrationsToDown) {
        this.logger.info(`Rolling back migration ${migration.name}`);

        await migration.down({
          client: this.dependencies.client,
          context: this.dependencies.migrationsContext,
        });

        await this.dependencies.migrationsStorage.remove([migration.name]);

        rollbackedMigrations++;
      }

      this.logger.success('Migrations rollback complete');

      return rollbackedMigrations;
    } finally {
      await this.dependencies.migrationsLock.releaseLock();
    }
  }
}
