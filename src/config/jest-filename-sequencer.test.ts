import FilenameSortedTestSequencer from './jest-filename-sequencer';
import type { Test } from '@jest/test-result';

const createMockTest = (path: string): Test => ({
  context: {
    config: {
      displayName: undefined,
      rootDir: '/mock/root',
    },
    hasteFS: {},
    moduleMap: {},
    resolver: {},
  },
  duration: undefined,
  path,
}) as Test;

describe('FilenameSortedTestSequencer', () => {
  let sequencer: FilenameSortedTestSequencer;

  beforeEach(() => {
    sequencer = new FilenameSortedTestSequencer();
  });

  describe('sort', () => {
    it('should sort tests by basename (filename)', () => {
      const tests = [
        createMockTest('/path/to/story-z.test.js'),
        createMockTest('/different/path/story-a.test.js'),
        createMockTest('/another/path/story-m.test.js'),
      ];

      const result = sequencer.sort(tests);

      expect(result.map(test => test.path)).toEqual([
        '/different/path/story-a.test.js',
        '/another/path/story-m.test.js',
        '/path/to/story-z.test.js',
      ]);
    });
  });

  describe('shard', () => {
    it('should sort tests first, then divide into shards correctly', () => {
      const tests = [
        createMockTest('/path/f-test.js'),
        createMockTest('/path/a-test.js'),
        createMockTest('/path/d-test.js'),
        createMockTest('/path/b-test.js'),
        createMockTest('/path/e-test.js'),
        createMockTest('/path/c-test.js'),
      ];

      const shard1 = sequencer.shard(tests, { shardIndex: 1, shardCount: 3 });
      expect(shard1.length).toBe(2);
      expect(shard1.map(test => test.path)).toEqual([
        '/path/a-test.js',
        '/path/b-test.js',
      ]);

      const shard2 = sequencer.shard(tests, { shardIndex: 2, shardCount: 3 });
      expect(shard2.length).toBe(2);
      expect(shard2.map(test => test.path)).toEqual([
        '/path/c-test.js',
        '/path/d-test.js',
      ]);

      const shard3 = sequencer.shard(tests, { shardIndex: 3, shardCount: 3 });
      expect(shard3.length).toBe(2);
      expect(shard3.map(test => test.path)).toEqual([
        '/path/e-test.js',
        '/path/f-test.js',
      ]);
    });

    it('should handle uneven shard distribution', () => {
      const tests = [
        createMockTest('/path/c-test.js'),
        createMockTest('/path/a-test.js'),
        createMockTest('/path/b-test.js'),
      ];

      const shard1 = sequencer.shard(tests, { shardIndex: 1, shardCount: 2 });
      expect(shard1.length).toBe(2);
      expect(shard1.map(test => test.path)).toEqual([
        '/path/a-test.js',
        '/path/b-test.js',
      ]);

      const shard2 = sequencer.shard(tests, { shardIndex: 2, shardCount: 2 });
      expect(shard2.length).toBe(1);
      expect(shard2.map(test => test.path)).toEqual([
        '/path/c-test.js',
      ]);
    });

    it('should handle empty test array', () => {
      const tests: Test[] = [];
      const result = sequencer.shard(tests, { shardIndex: 1, shardCount: 2 });
      expect(result).toEqual([]);
    });

    it('should handle single shard', () => {
      const tests = [
        createMockTest('/path/c-test.js'),
        createMockTest('/path/a-test.js'),
        createMockTest('/path/b-test.js'),
      ];

      const result = sequencer.shard(tests, { shardIndex: 1, shardCount: 1 });

      expect(result.map(test => test.path)).toEqual([
        '/path/a-test.js',
        '/path/b-test.js',
        '/path/c-test.js',
      ]);
    });
  });
});
