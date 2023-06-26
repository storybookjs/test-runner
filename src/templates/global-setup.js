import { playwrightGlobalSetup } from '../index';

module.exports = async function globalSetup(globalConfig) {
  return playwrightGlobalSetup(globalConfig);
};
