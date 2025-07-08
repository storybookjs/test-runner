import { getTestRunnerConfig } from './getTestRunnerConfig';

type TagOptions = {
  includeTags: string[];
  excludeTags: string[];
  skipTags: string[];
};

/**
 * Get filtering options based on:
 * 1. Test runner config 'tags' object
 * 2. Environment variables (takes precedence)
 */
export async function getTagOptions() {
  const config = await getTestRunnerConfig();

  let tagOptions = {
    includeTags: config?.tags?.include || ['test'],
    excludeTags: config?.tags?.exclude || [],
    skipTags: config?.tags?.skip || [],
  } as TagOptions;

  if (process.env.STORYBOOK_INCLUDE_TAGS) {
    tagOptions.includeTags = process.env.STORYBOOK_INCLUDE_TAGS.split(',').map((s) => s.trim());
  }

  if (process.env.STORYBOOK_EXCLUDE_TAGS) {
    tagOptions.excludeTags = process.env.STORYBOOK_EXCLUDE_TAGS.split(',').map((s) => s.trim());
  }

  if (process.env.STORYBOOK_SKIP_TAGS) {
    tagOptions.skipTags = process.env.STORYBOOK_SKIP_TAGS.split(',').map((s) => s.trim());
  }

  return tagOptions;
}
