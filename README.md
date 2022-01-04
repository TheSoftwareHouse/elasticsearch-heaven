

# Elasticsearch Heaven

This project was generated using [Nx](https://nx.dev).

It's a project which goal is to make your life with elasticsearch easier. 
Task that describes it can be found [here](https://headstart.atlassian.net/browse/ZN-156).

Currently, it supports following features:

- Generating, running and rollbacking migrations
- Interface for storing migrations and lock (with builtin option to store that in elasticsearch)

It is build as monorepo, in order to make it as modular as possible, so that you can only use the features that you will need. In future it will contain much more features, such as generating migrations basing on schema change, schema resolvers, ORM etc.

## Installation

In order to use only bare minimum from this package, run `npm install @tshio/elasticsearch-heaven-core`.

## Configuration

Create `elasticsearch-heaven.config.ts` file in root of your project. Minimal configuration looks like this:

```typescript
import { Config } from '@tshio/elasticsearch-heaven-core';
import * as path from 'path';

export default {
  clientOptions: {
    node: 'http://localhost:9200',
  },
  migrations: {
    migrationsDir: path.resolve(__dirname, './migrations'),
    migrationFileExt: 'ts',
    migrations: [],
  },
} as Config;

```

## Usage

### Creating and running migrations

In order to create new migration, run:
```shell
es-heaven create:migration --name=TestMigration --config-name=elasticsearch-heaven.config.ts
```

and then in your application:

```typescript
import config from './elasticsearch-heaven.config'
import { Connection } from "@tshio/elasticsearch-heaven-core";

const connection = await Connection.create(config);

await connection.runMigrations();
```

## Development

In order to start development you need to run elasticsearch locally via docker. To do that, run:

```shell
docker-compose up -d
```


### Generate a library

Run `nx g @nrwl/workspace:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@tshio/mylib`.

### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.
