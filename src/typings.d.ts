import { type TestHook } from './playwright/hooks';
import { type setupPage } from './setup-page';

declare global {
  var __sbPreRender: TestHook;
  var __sbPostRender: TestHook;
  var __getContext: (storyId: string) => any;
  var __sbSetupPage: typeof setupPage;
  var __sbCollectCoverage: boolean;
}
