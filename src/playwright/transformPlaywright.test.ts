import dedent from 'ts-dedent';
import path from 'path';
import * as storybookMain from '../util/getStorybookMain';

import { transformPlaywright } from './transformPlaywright';

jest.mock('storybook/internal/common', () => ({
  ...jest.requireActual('storybook/internal/common'),
  getProjectRoot: jest.fn(() => '/foo/bar'),
  normalizeStories: jest.fn(() => [
    {
      titlePrefix: 'Example',
      files: '**/*.stories.@(mdx|tsx|ts|jsx|js)',
      directory: './stories/basic',
      importPathMatcher:
        /^\.[\\/](?:stories\/basic(?:\/(?!\.)(?:(?:(?!(?:^|\/)\.).)*?)\/|\/|$)(?!\.)(?=.)[^/]*?\.stories\.(mdx|tsx|ts|jsx|js))$/,
    },
  ]),
}));

jest.mock('../util/getTestRunnerConfig');

expect.addSnapshotSerializer({
  print: (val: unknown) => (typeof val === 'string' ? val.trim() : String(val)),
  test: () => true,
});

describe('Playwright', () => {
  const filename = './stories/basic/Header.stories.js';
  beforeEach(() => {
    const relativeSpy = jest.spyOn(path, 'relative');
    relativeSpy.mockReturnValueOnce('stories/basic/Header.stories.js');
    jest.spyOn(storybookMain, 'getStorybookMain').mockImplementation(() => ({
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
      ],
    }));

    delete process.env.STORYBOOK_INCLUDE_TAGS;
    delete process.env.STORYBOOK_EXCLUDE_TAGS;
    delete process.env.STORYBOOK_SKIP_TAGS;
    delete process.env.STORYBOOK_PREVIEW_TAGS;
  });

  describe('tag filtering mechanism', () => {
    it('should include all stories when there is no tag filtering', () => {
      expect(
        transformPlaywright(
          dedent`
        export default { title: 'foo/bar', component: Button };
        export const A = { };
        export const B = { };
      `,
          filename
        )
      ).toMatchInlineSnapshot(`
        if (!require.main) {
          describe("Example/foo/bar", () => {
            describe("A", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--a",
                    title: "Example/foo/bar",
                    name: "A"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--a"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"A"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
            describe("B", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--b",
                    title: "Example/foo/bar",
                    name: "B"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--b"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"B"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
          });
        }
      `);
    });
    it('should exclude stories when excludeTags matches', () => {
      process.env.STORYBOOK_EXCLUDE_TAGS = 'exclude-test';
      expect(
        transformPlaywright(
          dedent`
        export default { title: 'foo/bar', component: Button };
        export const A = { tags: ['exclude-test'] };
        export const B = { };
      `,
          filename
        )
      ).toMatchInlineSnapshot(`
        if (!require.main) {
          describe("Example/foo/bar", () => {
            describe("B", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--b",
                    title: "Example/foo/bar",
                    name: "B"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--b"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"B"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
          });
        }
      `);
    });
    it('should skip stories when skipTags matches', () => {
      process.env.STORYBOOK_SKIP_TAGS = 'skip-test';
      expect(
        transformPlaywright(
          dedent`
        export default { title: 'foo/bar', component: Button };
        export const A = { tags: ['skip-test'] };
        export const B = { };
      `,
          filename
        )
      ).toMatchInlineSnapshot(`
        if (!require.main) {
          describe("Example/foo/bar", () => {
            describe("A", () => {
              it.skip("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--a",
                    title: "Example/foo/bar",
                    name: "A"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--a"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"A"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
            describe("B", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--b",
                    title: "Example/foo/bar",
                    name: "B"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--b"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"B"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
          });
        }
      `);
    });
    it('should work in conjunction with includeTags, excludeTags and skipTags', () => {
      process.env.STORYBOOK_INCLUDE_TAGS = 'play,design,global-tag';
      process.env.STORYBOOK_SKIP_TAGS = 'skip';
      process.env.STORYBOOK_EXCLUDE_TAGS = 'exclude';
      process.env.STORYBOOK_PREVIEW_TAGS = 'global-tag';

      // Should result in:
      // - A being excluded
      // - B being included, but skipped
      // - C being included
      // - D being included
      // - E being excluded
      expect(
        transformPlaywright(
          dedent`
        export default { title: 'foo/bar', component: Button };
        export const A = { tags: ['play', 'exclude'] };
        export const B = { tags: ['play', 'skip'] };
        export const C = { tags: ['design'] };
        export const D = { tags: ['global-tag'] };
        export const E = { };
      `,
          filename
        )
      ).toMatchInlineSnapshot(`
        if (!require.main) {
          describe("Example/foo/bar", () => {
            describe("B", () => {
              it.skip("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--b",
                    title: "Example/foo/bar",
                    name: "B"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--b"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"B"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
            describe("C", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--c",
                    title: "Example/foo/bar",
                    name: "C"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--c"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"C"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
            describe("D", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--d",
                    title: "Example/foo/bar",
                    name: "D"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--d"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"D"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
            describe("E", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--e",
                    title: "Example/foo/bar",
                    name: "E"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--e"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"E"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
          });
        }
      `);
    });
    it('should work with tag negation', () => {
      process.env.STORYBOOK_INCLUDE_TAGS = 'play,test';
      process.env.STORYBOOK_PREVIEW_TAGS = '!test';
      // Should result in:
      // - A being included
      // - B being excluded because it has no play nor test tag (removed by negation in preview tags)
      // - C being included because it has test tag (overwritten via story tags)
      expect(
        transformPlaywright(
          dedent`
        export default { title: 'foo/bar', component: Button, tags: ['play'] };
        export const A = { };
        export const B = { tags: ['!play']  };
        export const C = { tags: ['!play', 'test']  };
      `,
          filename
        )
      ).toMatchInlineSnapshot(`
        if (!require.main) {
          describe("Example/foo/bar", () => {
            describe("A", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--a",
                    title: "Example/foo/bar",
                    name: "A"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--a"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"A"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
            describe("C", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--c",
                    title: "Example/foo/bar",
                    name: "C"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--c"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"C"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
          });
        }
      `);
    });
    it('should include "test" tag by default', () => {
      // Should result in:
      // - A being included
      // - B being excluded
      expect(
        transformPlaywright(
          dedent`
        export default { title: 'foo/bar', component: Button };
        export const A = { };
        export const B = { tags: ['!test']  };
      `,
          filename
        )
      ).toMatchInlineSnapshot(`
        if (!require.main) {
          describe("Example/foo/bar", () => {
            describe("A", () => {
              it("smoke-test", async () => {
                const testFn = async () => {
                  const context = {
                    id: "example-foo-bar--a",
                    title: "Example/foo/bar",
                    name: "A"
                  };
                  if (globalThis.__sbPreVisit) {
                    await globalThis.__sbPreVisit(page, context);
                  }
                  let result;
                  try {
                    result = await page.addInitScript(({
                      id,
                      hasPlayFn
                    }) => __test(id, hasPlayFn), {
                      id: "example-foo-bar--a"
                    });
                  } catch (err) {
                    if (err.toString().includes('Execution context was destroyed')) {
                      throw err;
                    } else {
                      if (globalThis.__sbPostVisit) {
                        await globalThis.__sbPostVisit(page, {
                          ...context,
                          hasFailure: true
                        });
                      }
                      throw err;
                    }
                  }
                  if (globalThis.__sbPostVisit) {
                    await globalThis.__sbPostVisit(page, context);
                  }
                  if (globalThis.__sbCollectCoverage) {
                    const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                    if (!isCoverageSetupCorrectly) {
                      throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
          The code in this story is not instrumented, which means the coverage setup is likely not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                    }
                    await jestPlaywright.saveCoverage(page);
                  }
                  return result;
                };
                try {
                  await testFn();
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"A"}". Retrying...\`);
                    await jestPlaywright.resetPage();
                    await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                    await testFn();
                  } else {
                    throw err;
                  }
                }
              });
            });
          });
        }
      `);
    });
    it('should no op when includeTags is passed but not matched', () => {
      process.env.STORYBOOK_INCLUDE_TAGS = 'play';
      expect(
        transformPlaywright(
          dedent`
        export default { title: 'foo/bar', component: Button };
        export const A = () => {};
        A.play = () => {};
      `,
          filename
        )
      ).toMatchInlineSnapshot(`describe.skip('Example/foo/bar', () => { it('no-op', () => {}) });`);
    });
  });

  it('should generate a play test when the story has a play function', () => {
    expect(
      transformPlaywright(
        dedent`
        export default { title: 'foo/bar', component: Button };
        export const A = () => {};
        A.play = () => {};
      `,
        filename
      )
    ).toMatchInlineSnapshot(`
      if (!require.main) {
        describe("Example/foo/bar", () => {
          describe("A", () => {
            it("play-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-foo-bar--a",
                  title: "Example/foo/bar",
                  name: "A"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.addInitScript(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-foo-bar--a"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    if (globalThis.__sbPostVisit) {
                      await globalThis.__sbPostVisit(page, {
                        ...context,
                        hasFailure: true
                      });
                    }
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                  if (!isCoverageSetupCorrectly) {
                    throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
        The code in this story is not instrumented, which means the coverage setup is likely not correct.
        More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                  }
                  await jestPlaywright.saveCoverage(page);
                }
                return result;
              };
              try {
                await testFn();
              } catch (err) {
                if (err.toString().includes('Execution context was destroyed')) {
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"A"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });
      }
    `);
  });
  it('should generate a smoke test when story does not have a play function', () => {
    expect(
      transformPlaywright(
        dedent`
        export default { title: 'foo/bar' };
        export const A = () => {};
      `,
        filename
      )
    ).toMatchInlineSnapshot(`
      if (!require.main) {
        describe("Example/foo/bar", () => {
          describe("A", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-foo-bar--a",
                  title: "Example/foo/bar",
                  name: "A"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.addInitScript(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-foo-bar--a"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    if (globalThis.__sbPostVisit) {
                      await globalThis.__sbPostVisit(page, {
                        ...context,
                        hasFailure: true
                      });
                    }
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                  if (!isCoverageSetupCorrectly) {
                    throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
        The code in this story is not instrumented, which means the coverage setup is likely not correct.
        More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                  }
                  await jestPlaywright.saveCoverage(page);
                }
                return result;
              };
              try {
                await testFn();
              } catch (err) {
                if (err.toString().includes('Execution context was destroyed')) {
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/foo/bar"}/\${"A"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });
      }
    `);
  });
  it('should generate a smoke test with auto title', () => {
    expect(
      transformPlaywright(
        dedent`
        export default { component: Button };
        export const A = () => {};
      `,
        filename
      )
    ).toMatchInlineSnapshot(`
      if (!require.main) {
        describe("Example/Header", () => {
          describe("A", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-header--a",
                  title: "Example/Header",
                  name: "A"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.addInitScript(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-header--a"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    if (globalThis.__sbPostVisit) {
                      await globalThis.__sbPostVisit(page, {
                        ...context,
                        hasFailure: true
                      });
                    }
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
                  if (!isCoverageSetupCorrectly) {
                    throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
        The code in this story is not instrumented, which means the coverage setup is likely not correct.
        More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                  }
                  await jestPlaywright.saveCoverage(page);
                }
                return result;
              };
              try {
                await testFn();
              } catch (err) {
                if (err.toString().includes('Execution context was destroyed')) {
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Header"}/\${"A"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });
      }
    `);
  });
});
