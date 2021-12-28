export class FailedToCreateIndexError extends Error {
  constructor(indexName: string, reason: string) {
    super(`Failed to create index ${indexName}, reason: ${reason}`);
  }
}
