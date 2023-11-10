import { TestHook } from './playwright/hooks';
import { type setupPage } from './setup-page';
import type { StoryContext, StoryIdentifiers } from '@storybook/csf';
declare global {
  var __sbPreRender: TestHook;
  var __sbPostRender: TestHook;
  var __getContext: (storyId: string) => StoryContext | StoryIdentifiers;
  var __sbSetupPage: typeof setupPage;
  var __sbCollectCoverage: boolean;
}
