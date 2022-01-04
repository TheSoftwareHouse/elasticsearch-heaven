import { $ } from 'zx';
import * as path from 'path';
import * as fs from 'fs-extra';
import config from './testConfig';

const configDir = path.resolve(__dirname, 'testConfig.ts');
const migrationsDir = config.migrations.migrationsDir;

const cleanup = () => {
  if (fs.pathExistsSync(migrationsDir)) {
    fs.emptyDirSync(migrationsDir);
    fs.rmdirSync(migrationsDir);
  }
};

describe('Create migration command', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('should create new migration file', async () => {
    await $`npx nx run elasticsearch-heaven-core:cli-create-migration --name="TestMigration" --config-path=${configDir}`;

    const files = fs.readdirSync(migrationsDir);

    expect(files).toHaveLength(1);

    const migration = fs
      .readFileSync(path.join(migrationsDir, files[0]))
      .toString();

    expect(migration).toMatchSnapshot();
  });
});
