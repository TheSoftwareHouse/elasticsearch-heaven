import * as path from 'path';
import * as fs from 'fs-extra';
import { createMigrationName } from './migrationNaming';

const templateByExtension: Record<string, string[]> = {
  ts: [
    "import {MigrationBag} from '@elasticsearch-heaven/migrations'",
    '',
    'export async function up(bag: MigrationBag) {}',
    '',
    'export async function down(bag: MigrationBag) {}',
  ],
  js: [
    'export async function up(bag) {}',
    '',
    'export async function down(bag) {}',
  ],
};

export const createMigration = (
  migrationsDir: string,
  name: string,
  ext = 'ts'
) => {
  fs.ensureDirSync(migrationsDir);

  const migrationName = createMigrationName(name);

  const migrationFile = path.join(migrationsDir, `${migrationName}.${ext}`);

  if (fs.existsSync(migrationFile)) {
    throw new Error(`Migration ${migrationName} already exists`);
  }

  const template = (templateByExtension[ext] ?? templateByExtension.js).join(
    '\n'
  );

  fs.writeFileSync(migrationFile, template);
};
