export type IndexConfig<T> = {
  mappings: {
    properties: IndexProperties<T>;
  };
  settings?: {
    analysis: {
      analyzer?: Record<string, ElasiticAnalyzer>;
      normalizer?: Record<string, ElasiticAnalyzer>;
      tokenizer?: Record<string, ElasticTokenizer>;
    };
  };
};

export interface Hit<T> {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: T;
  sort?: unknown[];
  fields?: Record<string, unknown[]>;
}

export enum DataType {
  text = 'text',
  keyword = 'keyword',
  long = 'long',
  integer = 'integer',
  short = 'short',
  byte = 'byte',
  double = 'double',
  float = 'float',
  halfFloat = 'half_float',
  scaledFloat = 'scaled_float',
  date = 'date',
  dateNanos = 'date_nanos',
  boolean = 'boolean',
  binary = 'binary',
  integerRange = 'integer_range',
  floatRange = 'float_range',
  longRange = 'long_range',
  doubleRange = 'double_range',
  dateRange = 'date_range',
  object = 'object',
  nested = 'nested',
  geoPoint = 'geo_point',
  geoShape = 'geo_shape',
  ip = 'ip',
  completion = 'completion',
  tokenCount = 'token_count',
  murmur3 = 'murmur3',
  annotatedText = 'annotated-text',
  shape = 'shape',
}

export interface FieldMapping {
  type?: DataType;
  strategy?: string;
  properties?: Record<string, FieldMapping | undefined>;
  fields?: Record<string, FieldMapping>;
  analyzer?: string;
  normalizer?: string;
  doc_values?: boolean;
  search_analyzer?: string;
}

export type IndexProperties<T> = {
  [Key in keyof T]?: FieldMapping;
};

export interface ElasiticAnalyzer {
  type?: string;
  tokenizer?: string;
  char_filter?: unknown[];
  filter?: string[];
}

export interface ElasticTokenizer {
  type: string;
  min_gram?: number;
  max_gram?: number;
  token_chars?: string[];
}
