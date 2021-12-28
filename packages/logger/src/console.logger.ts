import { Logger } from './types';
import * as chalk from 'chalk';

const prefix = (prefix?: string) => {
  if (!prefix) {
    return undefined;
  }

  return `[${prefix}]`;
};

export const createConsoleLogger = (
  debug?: boolean,
  scope?: string
): Logger => ({
  info(...args) {
    console.log(prefix(scope), 'ℹ', ...args);
  },
  warn(...args) {
    console.log(prefix(scope), '⚠️', chalk.yellow(...args));
  },
  error(...args) {
    console.log(prefix(scope), '⛔️', chalk.red(...args));
  },
  success(...args) {
    console.log(prefix(scope), '✅', chalk.green(...args));
  },
  debug(...args) {
    if (debug) {
      console.log(prefix(scope), '🐞', chalk.blue(...args));
    }
  },

  createScope: (scope) => createConsoleLogger(debug, scope),
});
