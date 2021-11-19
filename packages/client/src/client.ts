import { Client, ClientOptions } from "@elastic/elasticsearch";

export function createClient(options: ClientOptions) {
  return new Client(options);
}
