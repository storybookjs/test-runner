import { TestHook } from './playwright/hooks';

declare global {
  var __sbPreVisit: TestHook;
  var __sbPostVisit: TestHook;
  var __getContext: (storyId: string) => any;
}
