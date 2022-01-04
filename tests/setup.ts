import './typings';
import { Client } from '@elastic/elasticsearch';
import {
  createConsoleLogger,
  waitForConnection,
} from '@tshio/elasticsearch-heaven-core';

beforeAll(async () => {
  global.esClient = new Client({
    node: 'http://localhost:9200',
  });

  await waitForConnection(global.esClient, createConsoleLogger());
});

beforeEach(async () => {
  await global.esClient.indices.delete({ index: '*' });
});
