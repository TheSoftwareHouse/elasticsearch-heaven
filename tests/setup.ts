import { Client } from '@elasticsearch-heaven/client';
import './typings';

beforeAll(async () => {
  global.esClient = new Client({
    node: 'http://localhost:9200',
  });

  await global.esClient.ping();
});

beforeEach(async () => {
  await global.esClient.indices.delete({ index: '*' });
});
