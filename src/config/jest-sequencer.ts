import Sequencer, { ShardOptions } from '@jest/test-sequencer';
import type { Test } from '@jest/test-result';
import { basename } from 'path';

/**
 * Sorts tests using basename for comparison when running against index JSON stories.
 * When tests include 'test-storybook-index-json__', this function sorts the tests
 * by their basename to ensure consistent ordering across different temporary directories,
 * while preserving the original test paths.
 *
 * @param tests - Array of Jest test objects
 * @returns Array of tests sorted by basename when index JSON pattern is detected, otherwise sorted by full path
 */
const sortForIndexJSON = (tests: Array<Test>): Array<Test> => {
  const isIndexJSON = tests.some((test) => test.path.includes('test-storybook-index-json__'));

  return tests.sort((a, b) => {
    const pathA = isIndexJSON ? basename(a.path) : a.path;
    const pathB = isIndexJSON ? basename(b.path) : b.path;
    return pathA > pathB ? 1 : -1;
  });
};

/**
 * Custom Jest sequencer for Storybook tests that ensures consistent
 * test ordering and proper sharding support for distributed test execution.
 */
class StorybookTestSequencer extends Sequencer {
  shard(tests: Array<Test>, { shardIndex, shardCount }: ShardOptions) {
    const shardSize = Math.ceil(tests.length / shardCount);
    const shardStart = shardSize * (shardIndex - 1);
    const shardEnd = shardSize * shardIndex;

    return sortForIndexJSON(tests).slice(shardStart, shardEnd);
  }

  sort(tests: Array<Test>) {
    return sortForIndexJSON(tests);
  }
}

export default StorybookTestSequencer;
