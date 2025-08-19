import Sequencer, { ShardOptions } from '@jest/test-sequencer';
import type { Test } from '@jest/test-result';
import { basename } from 'path';

const sortByFilename = (tests: Array<Test>): Array<Test> => {
  return tests.sort((a, b) => basename(a.path).localeCompare(basename(b.path)));
};

/**
 * Custom Jest Test Sequencer that sorts tests by their filenames.
 * This ensures consistent test execution when using sharding
 * against an externally deployed Storybook instance using --url.
 */
class FilenameSortedTestSequencer extends Sequencer {
  shard(tests: Array<Test>, { shardIndex, shardCount }: ShardOptions) {
    const shardSize = Math.ceil(tests.length / shardCount);
    const shardStart = shardSize * (shardIndex - 1);
    const shardEnd = shardSize * shardIndex;

    return sortByFilename(tests).slice(shardStart, shardEnd);
  }

  sort(tests: Array<Test>) {
    return sortByFilename(tests);
  }
}

export default FilenameSortedTestSequencer;
