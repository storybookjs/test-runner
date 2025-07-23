// Global type declarations for Storybook internal modules
import { TestHook } from './src/playwright/hooks';
import { type setupPage } from './src/setup-page';
import type { StoryContext } from 'storybook/internal/csf';

declare global {
  var __sbPreVisit: TestHook;
  var __sbPostVisit: TestHook;
  var __getContext: (storyId: string) => StoryContext;
  var __sbSetupPage: typeof setupPage;
  var __sbCollectCoverage: boolean;
}
