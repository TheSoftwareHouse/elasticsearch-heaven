import { EsMigrationLock } from './EsMigrationLock';
import { createConsoleLogger } from '../../logger';

describe('EsMigrationLock', () => {
  let migrationLock: EsMigrationLock;

  beforeEach(async () => {
    migrationLock = new EsMigrationLock(
      'migration_lock',
      global.esClient,
      createConsoleLogger()
    );
  });

  it('should acquire and release lock', async () => {
    expect(await migrationLock.acquireLock()).toEqual(true);
    expect(await migrationLock.acquireLock()).toEqual(false);

    await migrationLock.releaseLock();

    expect(await migrationLock.acquireLock()).toEqual(true);
  });
});
