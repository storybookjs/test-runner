import { playwrightGlobalSetup, type GlobalConfig } from '../index';

module.exports = function globalSetup(globalConfig: GlobalConfig) {
  return playwrightGlobalSetup(globalConfig);
};
