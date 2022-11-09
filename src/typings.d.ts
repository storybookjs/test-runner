import { TestHook } from './playwright/hooks';

declare global {
  var __sbPreRender: TestHook;
  var __sbPostRender: TestHook;
  var __getContext: (storyId: string) => any;
}
