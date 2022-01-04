import { isMigration } from './isMigration';
import * as glob from 'glob';
import * as path from 'path';
import {
  NamedMigration,
  ProvidedMigrations,
} from '@elasticsearch-heaven/types';

type FilteredMigrations = {
  migrations: NamedMigration[];
  paths: string[];
};

export const resolveMigrations = async (
  migrations: ProvidedMigrations
): Promise<NamedMigration[]> => {
  const filteredMigrations = migrations.reduce<FilteredMigrations>(
    (acc, migration) => {
      if (isMigration(migration)) {
        acc.migrations.push(migration);
      } else {
        acc.paths.push(...glob.sync(migration));
      }

      return acc;
    },
    {
      migrations: [],
      paths: [],
    }
  );

  const importedMigrations = await Promise.all(
    filteredMigrations.paths.map(loadMigration)
  );

  return [...filteredMigrations.migrations, ...importedMigrations];
};

const loadMigration = async (
  migrationPath: string
): Promise<NamedMigration> => {
  const migration = await import(migrationPath);

  if (!isMigration(migration)) {
    throw new Error(
      `Migration at ${migrationPath} does not export a valid migration.`
    );
  }

  return {
    ...migration,
    name: path.basename(migrationPath),
  };
};
