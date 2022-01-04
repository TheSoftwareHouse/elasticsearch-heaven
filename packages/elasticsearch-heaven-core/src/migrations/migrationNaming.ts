export const createMigrationName = (name: string) =>
  `${new Date().getTime()}_${name}`;
