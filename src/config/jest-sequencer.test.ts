import StorybookTestSequencer from './jest-sequencer';
import type { Test } from '@jest/test-result';

// Mock test data factory
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

describe('StorybookTestSequencer', () => {
  let sequencer: StorybookTestSequencer;

  beforeEach(() => {
    sequencer = new StorybookTestSequencer();
  });

  describe('sort', () => {
    it('should sort tests alphabetically by path', () => {
      const tests = [
        createMockTest('/path/to/z-test.js'),
        createMockTest('/path/to/a-test.js'),
        createMockTest('/path/to/m-test.js'),
      ];

      const result = sequencer.sort(tests);

      expect(result.map(test => test.path)).toEqual([
        '/path/to/a-test.js',
        '/path/to/m-test.js',
        '/path/to/z-test.js',
      ]);
    });

    it('should handle empty test array', () => {
      const tests: Test[] = [];
      const result = sequencer.sort(tests);
      expect(result).toEqual([]);
    });

    it('should handle single test', () => {
      const tests = [createMockTest('/path/to/single-test.js')];
      const result = sequencer.sort(tests);
      expect(result).toEqual(tests);
    });

    it('should normalize paths for index JSON tests', () => {
      const tests = [
        createMockTest('/path/to/test-storybook-index-json__1234567890/story-z.test.js'),
        createMockTest('/different/path/test-storybook-index-json__abcdefghijk/story-a.test.js'),
        createMockTest('/another/path/test-storybook-index-json__xyz9876543/story-m.test.js'),
      ];

      const result = sequencer.sort(tests);

      // After sorting by basename, original paths should be preserved but in sorted order
      expect(result.map(test => test.path)).toEqual([
        '/different/path/test-storybook-index-json__abcdefghijk/story-a.test.js',
        '/another/path/test-storybook-index-json__xyz9876543/story-m.test.js',
        '/path/to/test-storybook-index-json__1234567890/story-z.test.js',
      ]);
    });
  });

  describe('shard', () => {
    it('should divide tests into shards correctly', () => {
      const tests = [
        createMockTest('/path/to/a-test.js'),
        createMockTest('/path/to/b-test.js'),
        createMockTest('/path/to/c-test.js'),
        createMockTest('/path/to/d-test.js'),
        createMockTest('/path/to/e-test.js'),
        createMockTest('/path/to/f-test.js'),
      ];

      // Test first shard (1 of 3)
      const shard1 = sequencer.shard(tests, { shardIndex: 1, shardCount: 3 });
      expect(shard1.length).toBe(2);
      expect(shard1.map(test => test.path)).toEqual([
        '/path/to/a-test.js',
        '/path/to/b-test.js',
      ]);

      // Test second shard (2 of 3)
      const shard2 = sequencer.shard(tests, { shardIndex: 2, shardCount: 3 });
      expect(shard2.length).toBe(2);
      expect(shard2.map(test => test.path)).toEqual([
        '/path/to/c-test.js',
        '/path/to/d-test.js',
      ]);

      // Test third shard (3 of 3)
      const shard3 = sequencer.shard(tests, { shardIndex: 3, shardCount: 3 });
      expect(shard3.length).toBe(2);
      expect(shard3.map(test => test.path)).toEqual([
        '/path/to/e-test.js',
        '/path/to/f-test.js',
      ]);
    });

    it('should handle uneven division of tests', () => {
      const tests = [
        createMockTest('/path/to/a-test.js'),
        createMockTest('/path/to/b-test.js'),
        createMockTest('/path/to/c-test.js'),
        createMockTest('/path/to/d-test.js'),
        createMockTest('/path/to/e-test.js'),
      ];

      // With 5 tests and 3 shards: shard sizes should be [2, 2, 1]
      const shard1 = sequencer.shard(tests, { shardIndex: 1, shardCount: 3 });
      expect(shard1.length).toBe(2);

      const shard2 = sequencer.shard(tests, { shardIndex: 2, shardCount: 3 });
      expect(shard2.length).toBe(2);

      const shard3 = sequencer.shard(tests, { shardIndex: 3, shardCount: 3 });
      expect(shard3.length).toBe(1);
    });

    it('should handle single shard (no sharding)', () => {
      const tests = [
        createMockTest('/path/to/z-test.js'),
        createMockTest('/path/to/a-test.js'),
        createMockTest('/path/to/m-test.js'),
      ];

      const result = sequencer.shard(tests, { shardIndex: 1, shardCount: 1 });

      expect(result.length).toBe(3);
      expect(result.map(test => test.path)).toEqual([
        '/path/to/a-test.js',
        '/path/to/m-test.js',
        '/path/to/z-test.js',
      ]);
    });

    it('should sort tests before sharding', () => {
      const tests = [
        createMockTest('/path/to/z-test.js'),
        createMockTest('/path/to/a-test.js'),
        createMockTest('/path/to/m-test.js'),
        createMockTest('/path/to/b-test.js'),
      ];

      const shard1 = sequencer.shard(tests, { shardIndex: 1, shardCount: 2 });
      const shard2 = sequencer.shard(tests, { shardIndex: 2, shardCount: 2 });

      // First shard should get first 2 alphabetically sorted tests
      expect(shard1.map(test => test.path)).toEqual([
        '/path/to/a-test.js',
        '/path/to/b-test.js',
      ]);

      // Second shard should get last 2 alphabetically sorted tests
      expect(shard2.map(test => test.path)).toEqual([
        '/path/to/m-test.js',
        '/path/to/z-test.js',
      ]);
    });

    it('should normalize paths for index JSON tests before sharding', () => {
      const tests = [
        createMockTest('/different/path/test-storybook-index-json__xyz123/story-z.test.js'),
        createMockTest('/another/path/test-storybook-index-json__abc789/story-a.test.js'),
        createMockTest('/path/to/test-storybook-index-json__def456/story-m.test.js'),
        createMockTest('/final/path/test-storybook-index-json__ghi012/story-b.test.js'),
      ];

      const shard1 = sequencer.shard(tests, { shardIndex: 1, shardCount: 2 });
      const shard2 = sequencer.shard(tests, { shardIndex: 2, shardCount: 2 });

      // After sorting by basename but preserving original paths
      expect(shard1.map(test => test.path)).toEqual([
        '/another/path/test-storybook-index-json__abc789/story-a.test.js',
        '/final/path/test-storybook-index-json__ghi012/story-b.test.js',
      ]);

      expect(shard2.map(test => test.path)).toEqual([
        '/path/to/test-storybook-index-json__def456/story-m.test.js',
        '/different/path/test-storybook-index-json__xyz123/story-z.test.js',
      ]);
    });

    it('should handle empty test array for sharding', () => {
      const tests: Test[] = [];
      const result = sequencer.shard(tests, { shardIndex: 1, shardCount: 2 });
      expect(result).toEqual([]);
    });

    it('should handle out-of-bounds shard index', () => {
      const tests = [
        createMockTest('/path/to/a-test.js'),
        createMockTest('/path/to/b-test.js'),
      ];

      // Request shard 3 of 2 (out of bounds)
      const result = sequencer.shard(tests, { shardIndex: 3, shardCount: 2 });
      expect(result).toEqual([]);
    });
  });

  describe('normalizeTestPathsForIndexJSON integration', () => {
    it('should normalize when ANY test contains index JSON pattern', () => {
      const allIndexTests = [
        createMockTest('/path/to/test-storybook-index-json__temp1/story-a.test.js'),
        createMockTest('/different/test-storybook-index-json__temp2/story-b.test.js'),
      ];

      const mixedTests = [
        createMockTest('/path/to/test-storybook-index-json__temp3/story-a.test.js'),
        createMockTest('/path/to/regular-test.js'),
      ];

      const regularTests = [
        createMockTest('/path/to/regular-test-a.js'),
        createMockTest('/path/to/regular-test-b.js'),
      ];

      // All index tests should be sorted by basename but preserve original paths
      const allIndexResult = sequencer.sort(allIndexTests);
      expect(allIndexResult.map(test => test.path)).toEqual([
        '/path/to/test-storybook-index-json__temp1/story-a.test.js',
        '/different/test-storybook-index-json__temp2/story-b.test.js',
      ]);

      // Mixed tests should also sort by basename (since ANY test has index JSON pattern)
      const mixedResult = sequencer.sort(mixedTests);
      expect(mixedResult.map(test => test.path)).toEqual([
        '/path/to/regular-test.js',
        '/path/to/test-storybook-index-json__temp3/story-a.test.js',
      ]);

      // Regular tests should sort by full path
      const regularResult = sequencer.sort(regularTests);
      expect(regularResult.map(test => test.path)).toEqual([
        '/path/to/regular-test-a.js',
        '/path/to/regular-test-b.js',
      ]);
    });

    it('should sort by basename when ANY test contains index JSON pattern while preserving original paths', () => {
      const allIndexTests = [
        createMockTest('/path/to/test-storybook-index-json__temp1/story-b.test.js'),
        createMockTest('/different/test-storybook-index-json__temp2/story-a.test.js'),
      ];

      const mixedTests = [
        createMockTest('/path/to/test-storybook-index-json__temp3/story-z.test.js'),
        createMockTest('/path/to/regular-test.js'),
      ];

      const regularTests = [
        createMockTest('/path/to/regular-test-b.js'),
        createMockTest('/path/to/regular-test-a.js'),
      ];

      // All index tests should be sorted by basename but preserve original paths
      const allIndexResult = sequencer.sort(allIndexTests);
      expect(allIndexResult.map(test => test.path)).toEqual([
        '/different/test-storybook-index-json__temp2/story-a.test.js',
        '/path/to/test-storybook-index-json__temp1/story-b.test.js',
      ]);

      // Mixed tests should also sort by basename (since ANY test has index JSON pattern)
      const mixedResult = sequencer.sort(mixedTests);
      expect(mixedResult.map(test => test.path)).toEqual([
        '/path/to/regular-test.js',
        '/path/to/test-storybook-index-json__temp3/story-z.test.js',
      ]);

      // Regular tests should sort by full path
      const regularResult = sequencer.sort(regularTests);
      expect(regularResult.map(test => test.path)).toEqual([
        '/path/to/regular-test-a.js',
        '/path/to/regular-test-b.js',
      ]);
    });

    it('should handle mixed index JSON and regular tests (normalization applies when any test is index JSON)', () => {
      const tests = [
        createMockTest('/path/to/regular-test.js'),
        createMockTest('/path/to/test-storybook-index-json__temp123/story.test.js'),
      ];

      const result = sequencer.sort(tests);

      // Since ANY test contains index JSON pattern, sorting uses basename comparison but preserves original paths
      expect(result.map(test => test.path)).toEqual([
        '/path/to/regular-test.js',
        '/path/to/test-storybook-index-json__temp123/story.test.js',
      ]);
    });
  });
});
