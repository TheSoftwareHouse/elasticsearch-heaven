import {
  MigrationsRunner,
  MigrationsRunnerDependencies,
} from './MigrationsRunner';
import { createConsoleLogger } from '@elasticsearch-heaven/logger';
import { EsMigrationStorage } from '../storage/EsMigrationStorage';
import { EsMigrationLock } from '../storage/EsMigrationLock';
import * as path from 'path';
import * as fileMigration from './test/TestMigrationFile';

const createRunner = async ({
  migrations,
  migrationsContext,
}: Pick<MigrationsRunnerDependencies, 'migrations' | 'migrationsContext'>) => {
  const logger = createConsoleLogger();

  const migrationsStorage = new EsMigrationStorage(
    'migrations',
    global.esClient,
    logger
  );

  const runner = new MigrationsRunner({
    client: global.esClient,
    migrations,
    migrationsContext,
    logger,
    migrationsStorage,
    migrationsLock: new EsMigrationLock(
      'migrations_lock',
      global.esClient,
      logger
    ),
  });

  await runner.init();

  return {
    runner,
    migrationsStorage,
  };
};

describe('MigrationsRunner', () => {
  it('should run migrations from file and provided directly with custom context', async () => {
    const migration = jest.fn();
    const context = {
      now: new Date(),
    };

    const { runner, migrationsStorage } = await createRunner({
      migrationsContext: context,
      migrations: [
        {
          up: migration,
          down: jest.fn(),
          name: 'test',
        },
        path.resolve(__dirname, 'test/*.ts'),
      ],
    });

    let ranMigrations = await runner.up();

    expect(ranMigrations).toEqual(2);

    expect(migration).toHaveBeenCalledTimes(1);
    expect(fileMigration.up).toHaveBeenCalledTimes(1);
    expect(migration).toHaveBeenCalledWith({
      client: global.esClient,
      context,
    });

    const readMigrations = await migrationsStorage.read();

    expect(readMigrations).toHaveLength(2);

    // Assert that we won't run the same migrations twice
    ranMigrations = await runner.up();

    expect(ranMigrations).toEqual(0);
  });

  it('should rollback migration with custom context', async () => {
    const migration = jest.fn();
    const context = {
      now: new Date(),
    };

    const { runner, migrationsStorage } = await createRunner({
      migrationsContext: context,
      migrations: [
        {
          up: migration,
          down: jest.fn(),
          name: 'test',
        },
      ],
    });

    const ranMigrations = await runner.up();

    expect(ranMigrations).toEqual(1);

    expect(migration).toHaveBeenCalledTimes(1);
    expect(migration).toHaveBeenCalledWith({
      client: global.esClient,
      context,
    });

    const rollbackedMigrations = await runner.down(['test']);

    expect(rollbackedMigrations).toEqual(1);

    const readMigrations = await migrationsStorage.read();

    expect(readMigrations).toHaveLength(0);
  });
});
