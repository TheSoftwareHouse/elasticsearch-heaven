import {
  DataType,
  Logger,
  MigrationLock,
  MigrationsLockStorage,
} from '@elasticsearch-heaven/types';
import {
  createIndexIfNotExists,
  extractSourceFromResponse,
} from '../../client';
import { Client } from '@elastic/elasticsearch';

export class EsMigrationLock implements MigrationsLockStorage {
  private readonly logger: Logger;

  private readonly id = 'lock';

  constructor(
    private readonly indexName: string,
    private readonly client: Client,
    logger: Logger
  ) {
    this.logger = logger.createScope('EsMigrationLock');
  }

  private async initIfRequired() {
    await createIndexIfNotExists<MigrationLock>({
      indexName: this.indexName,
      logger: this.logger,
      client: this.client,
      body: {
        mappings: {
          properties: {
            id: {
              type: DataType.keyword,
            },
            date: {
              type: DataType.date,
            },
          },
        },
      },
    });
  }

  async acquireLock(): Promise<boolean> {
    await this.initIfRequired();

    const lockExists = await this.client.search({
      index: this.indexName,
    });

    const sources = extractSourceFromResponse<MigrationLock>(lockExists);

    if (sources.length) {
      return false;
    }

    await this.client.index({
      index: this.indexName,
      id: this.id,
      body: {
        id: this.id,
        date: new Date(),
      },
      refresh: 'wait_for',
    });

    return true;
  }

  async releaseLock(): Promise<void> {
    await this.client.delete({
      index: this.indexName,
      id: this.id,
      refresh: 'wait_for',
    });
  }
}
