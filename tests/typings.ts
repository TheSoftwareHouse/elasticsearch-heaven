import { Client } from '@elastic/elasticsearch';

declare global {
  namespace NodeJS {
    interface Global {
      esClient: Client;
    }
  }
}
