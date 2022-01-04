import { Migration } from '@elasticsearch-heaven/types';

export const isMigration = (value: unknown): value is Migration =>
  typeof value === 'object' &&
  'up' in (value as Record<string, unknown>) &&
  'down' in (value as Record<string, unknown>);
