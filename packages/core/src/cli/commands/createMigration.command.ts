import { readConfig } from '@elasticsearch-heaven/config';
import { createMigration } from '@elasticsearch-heaven/migrations';
import { createBaseCommand } from './baseCommand';

export const createMigrationCommand = createBaseCommand('create:migration')
  .description('Creates new migration file')
  .requiredOption('-n, --name <name>', 'Name of the migration')
  .action(async (args: { name: string; configPath: string }) => {
    const config = await readConfig(args.configPath);

    createMigration(
      config.migrations.migrationsDir,
      args.name,
      config.migrations.migrationFileExt
    );
  });
