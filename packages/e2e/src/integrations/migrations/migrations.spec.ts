import { Connection } from '@elasticsearch-heaven/core';
import * as path from 'path';

describe('Migrations', () => {
  let connection: Connection;

  beforeEach(async () => {
    connection = await Connection.create({
      client: global.esClient,
      migrations: {
        migrations: [path.resolve(__dirname, 'migrations/*.ts')],
        migrationsDir: path.resolve(__dirname, 'migrations'),
        migrationFileExt: 'ts',
      },
    });
  });

  it('should run and rollback migrations', async () => {
    let result = await connection.runMigrations();

    expect(result).toEqual(1);

    let exists = await global.esClient.indices.exists({
      index: 'test',
    });

    expect(exists.body).toEqual(true);

    result = await connection.runMigrations();

    expect(result).toEqual(0);

    const rollbackResult = await connection.rollbackMigrations([
      'TestMigration.ts',
    ]);

    expect(rollbackResult).toEqual(1);

    exists = await global.esClient.indices.exists({
      index: 'test',
    });

    expect(exists.body).toEqual(false);
  });
});
