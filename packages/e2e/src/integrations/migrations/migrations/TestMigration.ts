import { MigrationBag } from '@elasticsearch-heaven/types';

export const up = async ({ client }: MigrationBag) => {
  await client.indices.create({
    index: 'test',
  });
};

export const down = async ({ client }: MigrationBag) => {
  await client.indices.delete({
    index: 'test',
  });
};
