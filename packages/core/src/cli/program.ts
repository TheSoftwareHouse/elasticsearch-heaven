import { program } from 'commander';
import { createMigrationCommand } from './commands/createMigration.command';

program.addCommand(createMigrationCommand).parse(process.argv);
