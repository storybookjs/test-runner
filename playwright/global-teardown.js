// global-teardown.mjs
import { globalTeardown as playwrightGlobalTeardown } from 'jest-playwright-preset';

export default async function globalTeardown(globalConfig) {
  // Your global teardown
  await playwrightGlobalTeardown(globalConfig);
}
