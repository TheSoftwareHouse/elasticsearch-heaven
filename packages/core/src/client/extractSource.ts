import { Hit } from '@elasticsearch-heaven/types';
import { ApiResponse } from '@elastic/elasticsearch';

export const extractSource = <T>(hits: Hit<T>[]) =>
  hits.map((hit) => hit._source);

export const extractSourceFromResponse = <T>(response: ApiResponse) =>
  extractSource<T>(response.body.hits.hits);
