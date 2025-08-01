// global-setup.mjs
import { globalSetup as playwrightGlobalSetup } from 'jest-playwright-preset';

export default async function globalSetup(globalConfig) {
  return playwrightGlobalSetup(globalConfig);
}
