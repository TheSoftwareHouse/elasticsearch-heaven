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
    console.log(prefix(scope), prefix('INFO ℹ'), ...args);
  },
  warn(...args) {
    console.log(prefix(scope), prefix('WARN ⚠️'), chalk.yellow(...args));
  },
  error(...args) {
    console.log(prefix(scope), prefix('ERROR ⛔️'), chalk.red(...args));
  },
  success(...args) {
    console.log(prefix(scope), prefix('SUCCESS ✅'), chalk.green(...args));
  },
  debug(...args) {
    if (debug) {
      console.log(prefix(scope), prefix('DEBUG 🐞'), chalk.blue(...args));
    }
  },

  createScope: (scope) => createConsoleLogger(debug, scope),
});
