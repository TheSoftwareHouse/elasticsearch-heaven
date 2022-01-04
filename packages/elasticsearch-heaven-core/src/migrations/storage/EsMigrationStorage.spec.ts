import { EsMigrationStorage } from './EsMigrationStorage';
import { v4 } from 'uuid';
import { MigrationEntry } from '@tshio/elasticsearch-heaven-types';
import { createConsoleLogger } from '../../logger';

describe('ES Migration Storage', () => {
  let esMigrationStorage: EsMigrationStorage;

  beforeEach(() => {
    esMigrationStorage = new EsMigrationStorage(
      'migrations',
      global.esClient,
      createConsoleLogger()
    );
  });

  it('should create index if required', async () => {
    await esMigrationStorage.read();

    const indexData = await global.esClient.indices.get({
      index: 'migrations',
    });

    expect(indexData.body.migrations.mappings).toMatchSnapshot();
  });

  it('should read and write migrations', async () => {
    const migrations: MigrationEntry[] = [
      {
        id: v4(),
        timestamp: new Date(),
        name: 'test',
      },
      {
        id: v4(),
        timestamp: new Date(),
        name: 'test1',
      },
    ];

    await esMigrationStorage.write(migrations);

    const result = await esMigrationStorage.read();

    expect(result).toEqual(
      migrations.map((m) => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
      }))
    );
  });
});
