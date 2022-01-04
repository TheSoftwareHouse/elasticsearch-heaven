import { Client } from '@elastic/elasticsearch';
import { Logger } from '@tshio/elasticsearch-heaven-types';

export async function waitForConnection(client: Client, logger: Logger) {
  let isConnected = false;

  while (!isConnected) {
    try {
      logger.info(
        `Trying to connect to Elasticsearch at ${client.connectionPool
          .getConnection()
          ?.url?.toString()}`
      );

      await client.cluster.health();

      isConnected = true;

      logger.success(`Connected to Elasticsearch`);
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  return isConnected;
}
