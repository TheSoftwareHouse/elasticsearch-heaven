import { Client } from '@elastic/elasticsearch';
import { IndexConfig } from '@elasticsearch-heaven/types';
import { Logger } from '@elasticsearch-heaven/logger';
import { FailedToCreateIndexError } from '@elasticsearch-heaven/errors';

export interface CreateIndexIfNotExistsParams<T> {
  client: Client;
  indexName: string;
  body: IndexConfig<T>;
  logger: Logger;
}

export const createIndexIfNotExists = async <T>({
  indexName,
  body,
  client,
  logger,
}: CreateIndexIfNotExistsParams<T>) => {
  logger.debug(`Checking if index ${indexName} exists.`);

  const indexExists = await client.indices.exists({
    index: indexName,
  });

  if (!indexExists.body) {
    logger.info(`${indexName} index doesn't exist. Creating it.`);

    const response = await client.indices.create({
      index: indexName,
      body,
    });

    if (!response.body?.acknowledged) {
      throw new FailedToCreateIndexError(
        indexName,
        JSON.stringify(response.body)
      );
    }

    logger.success(`${indexName} index created.`);
  }
};
