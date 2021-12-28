import { Client } from '@elasticsearch-heaven/client';

declare global {
  namespace NodeJS {
    interface Global {
      esClient: Client;
    }
  }
}
