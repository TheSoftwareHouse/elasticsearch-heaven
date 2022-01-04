import { resolveConfig } from './resolveConfig';

const fileNames = ['tshio.config.js', 'tshio.config.ts'];

export const readConfig = async (configPath?: string) => {
  if (configPath) {
    const config = await import(configPath);

    return resolveConfig(config.default);
  }

  for (const fileName of fileNames) {
    try {
      const config = await import(`./${fileName}`);

      return resolveConfig(config.default);
    } catch (e) {
      // do nothing
    }
  }

  throw new Error('No config file found.');
};
