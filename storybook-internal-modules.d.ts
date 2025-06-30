// Global type declarations for Storybook internal modules
declare module 'storybook/internal/common' {
  export interface StorybookConfig {
    framework?: string;
    stories?: string[];
    addons?: string[];
    [key: string]: any;
  }

  export function getProjectRoot(): string;
  export function getStorybookMain(): any;
  export function getStorybookConfig(): StorybookConfig;
}

declare module 'storybook/internal/csf-tools' {
  export interface Story {
    id: string;
    name: string;
    parameters?: any;
    [key: string]: any;
  }

  export interface StoryIndex {
    stories: Record<string, Story>;
  }

  export function loadStoryIndex(storybookUrl: string): Promise<StoryIndex>;
  export function getStoriesJsonData(storybookUrl: string): Promise<any>;
}

declare module 'storybook/internal/telemetry' {
  export function getTelemetry(): any;
  export function trackEvent(event: string, data?: any): void;
}

declare module 'storybook/internal/csf' {
  export interface StoryContext {
    id: string;
    name: string;
    kind: string;
    parameters: any;
    args: any;
    globals: any;
    [key: string]: any;
  }

  export interface Story {
    id: string;
    name: string;
    parameters?: any;
    [key: string]: any;
  }
}

declare module 'storybook/internal/preview-api' {
  export interface PreviewAPI {
    [key: string]: any;
  }

  export function getPreviewAPI(): PreviewAPI;
}

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
