import { createBaseCommand } from './baseCommand';
import { createMigration } from '../../migrations';
import { readConfig } from '../../config';

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
