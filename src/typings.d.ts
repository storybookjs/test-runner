import { TestHook } from './playwright/hooks';
import { type setupPage } from './setup-page';
import type { StoryContext } from 'storybook/internal/csf';

declare global {
  var __sbPreVisit: TestHook;
  var __sbPostVisit: TestHook;
  var __getContext: (storyId: string) => StoryContext;
  var __sbSetupPage: typeof setupPage;
  var __sbCollectCoverage: boolean;
}
