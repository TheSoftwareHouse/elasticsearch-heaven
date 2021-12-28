import { Command } from 'commander';

export const createBaseCommand = (name: string) =>
  new Command(name).option(
    '--configPath <config>',
    'Path to configuration file'
  );
