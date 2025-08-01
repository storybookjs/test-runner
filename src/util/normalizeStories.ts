import type { NormalizedStoriesSpecifier, StoriesEntry } from 'storybook/internal/types';
import * as pico from 'picomatch';
import { basename, dirname, relative, resolve, sep } from 'node:path';

import slash from 'slash';
import { lstatSync } from 'node:fs';

const DEFAULT_TITLE_PREFIX = '';
export const DEFAULT_FILES_PATTERN = '**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))';

interface NormalizeOptions {
  configDir: string;
  workingDir: string;
  defaultFilesPattern?: string;
}

const isDirectory = (configDir: string, entry: string) => {
  try {
    return lstatSync(resolve(configDir, entry)).isDirectory();
  } catch (err) {
    return false;
  }
};

export const normalizeStoriesEntry = (
  entry: StoriesEntry,
  { configDir, workingDir, defaultFilesPattern = DEFAULT_FILES_PATTERN }: NormalizeOptions
): NormalizedStoriesSpecifier => {
  let specifierWithoutMatcher: Omit<NormalizedStoriesSpecifier, 'importPathMatcher'>;

  if (typeof entry === 'string') {
    const globResult = pico.scan(entry);
    if (globResult.isGlob) {
      const directory = globResult.prefix + globResult.base;
      const files = globResult.glob;

      specifierWithoutMatcher = {
        titlePrefix: DEFAULT_TITLE_PREFIX,
        directory,
        files,
      };
    } else if (isDirectory(configDir, entry)) {
      specifierWithoutMatcher = {
        titlePrefix: DEFAULT_TITLE_PREFIX,
        directory: entry,
        files: defaultFilesPattern,
      };
    } else {
      specifierWithoutMatcher = {
        titlePrefix: DEFAULT_TITLE_PREFIX,
        directory: dirname(entry),
        files: basename(entry),
      };
    }
  } else {
    specifierWithoutMatcher = {
      titlePrefix: DEFAULT_TITLE_PREFIX,
      files: defaultFilesPattern,
      ...entry,
    };
  }

  // We are going to be doing everything with node importPaths which use
  // URL format, i.e. `/` as a separator, so let's make sure we've normalized
  const files = slash(specifierWithoutMatcher.files);

  // At this stage `directory` is relative to `main.js` (the config dir)
  // We want to work relative to the working dir, so we transform it here.
  const { directory: directoryRelativeToConfig } = specifierWithoutMatcher;

  const directory = slash(
    getDirectoryFromWorkingDir({
      configDir,
      workingDir,
      directory: directoryRelativeToConfig,
    })
  ).replace(/\/$/, '');

  // Now make the importFn matcher.
  const importPathMatcher = globToRegexp(`${directory}/${files}`);

  return {
    ...specifierWithoutMatcher,
    directory,
    importPathMatcher,
  };
};

export const normalizeStories = (entries: StoriesEntry[], options: NormalizeOptions) => {
  if (!entries || (Array.isArray(entries) && entries.length === 0)) {
    throw new Error('InvalidStoriesEntryError');
  }

  return entries.map((entry) => normalizeStoriesEntry(entry, options));
};

export const getDirectoryFromWorkingDir = ({
  configDir,
  workingDir,
  directory,
}: NormalizeOptions & { directory: string }) => {
  const directoryFromConfig = resolve(configDir, directory);
  const directoryFromWorking = relative(workingDir, directoryFromConfig);

  // relative('/foo', '/foo/src') => 'src'
  // but we want `./src` to match importPaths
  return normalizeStoryPath(directoryFromWorking);
};

export function globToRegexp(glob: string) {
  const regex = pico.makeRe(glob, {
    fastpaths: false,
    noglobstar: false,
    bash: false,
  });

  if (!regex.source.startsWith('^')) {
    throw new Error(`Invalid glob: >> ${glob} >> ${regex}`);
  }

  if (!glob.startsWith('./')) {
    return regex;
  }

  // makeRe is sort of funny. If you pass it a directory starting with `./` it
  // creates a matcher that expects files with no prefix (e.g. `src/file.js`)
  // but if you pass it a directory that starts with `../` it expects files that
  // start with `../`. Let's make it consistent.
  // Globs starting `**` require special treatment due to the regex they
  // produce, specifically a negative look-ahead
  return new RegExp(
    ['^\\.', glob.startsWith('./**') ? '' : '[\\\\/]', regex.source.substring(1)].join('')
  );
}

const relativePattern = /^\.{1,2}([/\\]|$)/;
export function normalizeStoryPath(filename: string) {
  if (relativePattern.test(filename)) {
    return filename;
  }

  return `.${sep}${filename}`;
}
