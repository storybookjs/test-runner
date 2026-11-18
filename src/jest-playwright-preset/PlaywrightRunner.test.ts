import type { Test } from 'jest-runner';
import { describe, it, expect } from 'vitest';
import { dedupeBrowserTests } from './PlaywrightRunner';

const makeTest = (overrides: Partial<any>): Test =>
  ({
    path: '/tmp/sample.test.js',
    context: {
      config: {
        browserName: 'chromium',
        deviceName: null,
        displayName: { name: 'chromium' },
      },
    },
    ...overrides,
  } as unknown as Test);

describe('dedupeBrowserTests', () => {
  it('removes duplicated browser test entries with same path/browser/device/displayName', () => {
    const base = makeTest({});
    const duplicate = makeTest({});

    const result = dedupeBrowserTests([base, duplicate]);
    expect(result).toHaveLength(1);
  });

  it('keeps entries for different browsers', () => {
    const chromium = makeTest({
      context: { config: { browserName: 'chromium', deviceName: null, displayName: { name: 'chromium' } } },
    });
    const firefox = makeTest({
      context: { config: { browserName: 'firefox', deviceName: null, displayName: { name: 'firefox' } } },
    });

    const result = dedupeBrowserTests([chromium, firefox]);
    expect(result).toHaveLength(2);
  });
});
