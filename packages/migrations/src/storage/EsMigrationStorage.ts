import { Client, createIndexIfNotExists } from '@elasticsearch-heaven/client';
import { extractSourceFromResponse } from '@elasticsearch-heaven/index';
import { Logger } from '@elasticsearch-heaven/logger';
import {
  DataType,
  MigrationEntry,
  MigrationsStorage,
} from '@elasticsearch-heaven/types';

export class EsMigrationStorage implements MigrationsStorage {
  private readonly logger: Logger;

  constructor(
    private readonly indexName: string,
    private readonly client: Client,
    logger: Logger
  ) {
    this.logger = logger.createScope('EsMigrationStorage');
  }

  private async initIfRequired() {
    this.logger.debug(`Checking if index ${this.indexName} exists.`);

    await createIndexIfNotExists<MigrationEntry>({
      indexName: this.indexName,
      client: this.client,
      logger: this.logger,
      body: {
        mappings: {
          properties: {
            id: {
              type: DataType.keyword,
            },
            name: {
              type: DataType.keyword,
            },
            timestamp: {
              type: DataType.date,
            },
          },
        },
      },
    });
  }

  async read() {
    await this.initIfRequired();

    const response = await this.client.search({
      index: this.indexName,
    });

    return extractSourceFromResponse<MigrationEntry>(response);
  }

  async remove(names: string[]) {
    await this.client.deleteByQuery({
      index: this.indexName,
      wait_for_completion: true,
      body: {
        query: {
          terms: {
            name: names,
          },
        },
      },
    });
  }

  async write(migrations: MigrationEntry[]) {
    await this.initIfRequired();

    this.logger.debug(
      `Writing ${migrations.length} migrations to index ${this.indexName}`
    );

    const response = await this.client.bulk({
      refresh: 'wait_for',
      body: migrations.flatMap((migration) => [
        {
          create: {
            _index: this.indexName,
            _id: migration.id,
          },
        },
        migration,
      ]),
    });

    let savedMigrations = migrations.length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.body.items.forEach((item: Record<string, any>, index: number) => {
      const operation = Object.keys(item)[0];
      const error = item[operation].error;

      if (error) {
        savedMigrations--;

        this.logger.error(
          `ES create request #${index}: ${JSON.stringify(
            migrations[index]
          )} failed`,
          error
        );
      }
    });

    this.logger.debug(`${savedMigrations} migrations saved.`);
  }
}
