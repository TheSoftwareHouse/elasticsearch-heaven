import type { Client } from '@elastic/elasticsearch';

export interface MigrationEntry {
  // ID of migration (in uuid format)
  id: string;
  name: string;
  timestamp: Date;
}

export interface MigrationBag<Context = unknown> {
  client: Client;
  context: Context;
}

export interface Migration<Context = unknown> {
  up: (bag: MigrationBag<Context>) => Promise<void>;
  down: (bag: MigrationBag<Context>) => Promise<void>;
}

export interface NamedMigration<Context = unknown> extends Migration<Context> {
  name: string;
}

export type ProvidedMigrations<Context = unknown> = Array<
  string | NamedMigration<Context>
>;

interface BaseMigrationOptions<Context = unknown> {
  // Array of either glob patterns to migration files, or migrations themselves
  migrations: ProvidedMigrations<Context>;

  // Optional context that will be passed to migrations
  migrationsContext?: Context;

  // Extension for migration files
  migrationFileExt?: string;

  // Directory where migrations are stored (used for generating new migrations)
  migrationsDir: string;
}

export interface EsMigrationLockStorageOptions {
  // Name Of index in which migration lock will be stored
  lockIndexName?: string;
}

export type MigrationsStorageOptions =
  | {
      migrationsStorage: MigrationsStorage;
    }
  | {
      // Name of index in which migrations will be stored
      migrationsIndexName?: string;
    };
export type MigrationLockOptions =
  | {
      lock: MigrationsLockStorage;
    }
  | {
      // Index in which lock state will be stored
      lockIndexName?: string;
    };
export type MigrationOptions<Context = unknown> =
  BaseMigrationOptions<Context> &
    MigrationsStorageOptions &
    MigrationLockOptions;
export type MigrationLockStorage =
  | EsMigrationLockStorageOptions
  | {
      migrationLockStorage: MigrationsLockStorage;
    };

export interface MigrationsLockStorage {
  // Returns true if migration lock is acquired
  acquireLock(): Promise<boolean>;

  releaseLock(): Promise<void>;
}

export interface MigrationLock {
  id: string;
  date: Date;
}

export interface MigrationsStorage {
  // Writes completed migrations into storage
  write: (migrations: MigrationEntry[]) => Promise<void>;

  // Removes provided migrations from storage
  remove: (migrationNames: string[]) => Promise<void>;

  // Reads all migrations from storage
  read: () => Promise<MigrationEntry[]>;
}
