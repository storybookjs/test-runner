import {
  UnsupportedVersion,
  V3StoriesIndex,
  V4Index,
  makeDescribe,
  transformPlaywrightJson,
} from './transformPlaywrightJson';
import * as t from '@babel/types';

jest.mock('../util/getTestRunnerConfig');

describe('Playwright Json', () => {
  describe('v4 indexes', () => {
    beforeEach(() => {
      delete process.env.STORYBOOK_INCLUDE_TAGS;
      delete process.env.STORYBOOK_EXCLUDE_TAGS;
      delete process.env.STORYBOOK_SKIP_TAGS;
    });

    it('should generate a test for each story', () => {
      const input = {
        v: 4,
        entries: {
          'example-header--logged-in': {
            id: 'example-header--logged-in',
            title: 'Example/Header',
            name: 'Logged In',
            tags: ['test', 'play-fn'],
          },
          'example-header--logged-out': {
            id: 'example-header--logged-out',
            title: 'Example/Header',
            name: 'Logged Out',
            tags: ['test'],
          },
          'example-page--logged-in': {
            id: 'example-page--logged-in',
            title: 'Example/Page',
            name: 'Logged In',
            tags: ['test'],
          },
        },
      } satisfies V4Index;
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        {
          "example-header": "describe("Example/Header", () => {
          describe("Logged In", () => {
            it("play-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-header--logged-in",
                  title: "Example/Header",
                  name: "Logged In"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-header--logged-in"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Header"}/\${"Logged In"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
          describe("Logged Out", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-header--logged-out",
                  title: "Example/Header",
                  name: "Logged Out"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-header--logged-out"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Header"}/\${"Logged Out"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });",
          "example-page": "describe("Example/Page", () => {
          describe("Logged In", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-page--logged-in",
                  title: "Example/Page",
                  name: "Logged In"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-page--logged-in"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Page"}/\${"Logged In"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });",
        }
      `);
    });

    it('should respect include, exclude and skip tags', () => {
      process.env.STORYBOOK_INCLUDE_TAGS = 'play,design';
      process.env.STORYBOOK_SKIP_TAGS = 'skip';
      process.env.STORYBOOK_EXCLUDE_TAGS = 'exclude';
      const input = {
        v: 4,
        entries: {
          A: {
            id: 'example-a',
            title: 'Example/Header',
            name: 'Logged In',
            importPath: './stories/basic/Header.stories.js',
            tags: ['play', 'exclude'],
          },
          B: {
            id: 'example-b',
            title: 'Example/Header',
            name: 'Logged Out',
            importPath: './stories/basic/Header.stories.js',
            tags: ['play', 'skip'],
          },
          C: {
            id: 'example-c',
            title: 'Example/Page',
            name: 'Logged In',
            importPath: './stories/basic/Page.stories.js',
            tags: ['design'],
          },
          D: {
            id: 'example-d',
            title: 'Example/Page',
            name: 'Logged In',
            importPath: './stories/basic/Page.stories.js',
          },
        },
      };
      // Should result in:
      // - A being excluded
      // - B being included, but skipped
      // - C being included
      // - D being excluded
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        {
          "example-header": "describe("Example/Header", () => {
          describe("Logged Out", () => {
            it.skip("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-b",
                  title: "Example/Header",
                  name: "Logged Out"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-b"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Header"}/\${"Logged Out"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });",
          "example-page": "describe("Example/Page", () => {
          describe("Logged In", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-c",
                  title: "Example/Page",
                  name: "Logged In"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-c"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Page"}/\${"Logged In"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });",
        }
      `);
    });

    it('should skip docs entries', () => {
      const input = {
        v: 4,
        entries: {
          'example-introduction--page': {
            type: 'docs',
            id: 'example-introduction--page',
            title: 'Example/Introduction',
            name: 'Page',
          },
          'example-page--logged-in': {
            id: 'example-page--logged-in',
            title: 'Example/Page',
            name: 'Logged In',
          },
        },
      } satisfies V4Index;
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        {
          "example-page": "describe("Example/Page", () => {
          describe("Logged In", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-page--logged-in",
                  title: "Example/Page",
                  name: "Logged In"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-page--logged-in"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Page"}/\${"Logged In"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });",
        }
      `);
    });
  });

  describe('v3 indexes', () => {
    it('should generate a test for each story', () => {
      const input = {
        v: 3,
        stories: {
          'example-header--logged-in': {
            id: 'example-header--logged-in',
            title: 'Example/Header',
            name: 'Logged In',
            parameters: {
              __id: 'example-header--logged-in',
              docsOnly: false,
              fileName: './stories/basic/Header.stories.js',
            },
          },
          'example-header--logged-out': {
            id: 'example-header--logged-out',
            title: 'Example/Header',
            name: 'Logged Out',
            parameters: {
              __id: 'example-header--logged-out',
              docsOnly: false,
              fileName: './stories/basic/Header.stories.js',
            },
          },
          'example-page--logged-in': {
            id: 'example-page--logged-in',
            title: 'Example/Page',
            name: 'Logged In',
            parameters: {
              __id: 'example-page--logged-in',
              docsOnly: false,
              fileName: './stories/basic/Page.stories.js',
            },
          },
        },
      } satisfies V3StoriesIndex;
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        {
          "example-header": "describe("Example/Header", () => {
          describe("Logged In", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-header--logged-in",
                  title: "Example/Header",
                  name: "Logged In"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-header--logged-in"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Header"}/\${"Logged In"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
          describe("Logged Out", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-header--logged-out",
                  title: "Example/Header",
                  name: "Logged Out"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-header--logged-out"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Header"}/\${"Logged Out"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });",
          "example-page": "describe("Example/Page", () => {
          describe("Logged In", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-page--logged-in",
                  title: "Example/Page",
                  name: "Logged In"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-page--logged-in"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Page"}/\${"Logged In"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });",
        }
      `);
    });

    it('should skip docs-only stories', () => {
      const input = {
        v: 3,
        stories: {
          'example-introduction--page': {
            id: 'example-introduction--page',
            title: 'Example/Introduction',
            name: 'Page',
            parameters: {
              __id: 'example-introduction--page',
              docsOnly: true,
              fileName: './stories/basic/Introduction.stories.mdx',
            },
          },
          'example-page--logged-in': {
            id: 'example-page--logged-in',
            title: 'Example/Page',
            name: 'Logged In',
            parameters: {
              __id: 'example-page--logged-in',
              docsOnly: false,
              fileName: './stories/basic/Page.stories.js',
            },
          },
        },
      } satisfies V3StoriesIndex;
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        {
          "example-page": "describe("Example/Page", () => {
          describe("Logged In", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-page--logged-in",
                  title: "Example/Page",
                  name: "Logged In"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-page--logged-in"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Page"}/\${"Logged In"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });",
        }
      `);
    });

    it('should include "test" tag by default', () => {
      process.env.STORYBOOK_INCLUDE_TAGS = 'test';
      const input = {
        v: 3,
        stories: {
          'example-page--logged-in': {
            id: 'example-page--logged-in',
            title: 'Example/Page',
            name: 'Logged In',
            parameters: {
              __id: 'example-page--logged-in',
              docsOnly: false,
              fileName: './stories/basic/Page.stories.js',
            },
          },
        },
      } satisfies V3StoriesIndex;
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        {
          "example-page": "describe("Example/Page", () => {
          describe("Logged In", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-page--logged-in",
                  title: "Example/Page",
                  name: "Logged In"
                };
                if (globalThis.__sbPreVisit) {
                  await globalThis.__sbPreVisit(page, context);
                }
                let result;
                try {
                  result = await page.evaluate(({
                    id,
                    hasPlayFn
                  }) => __test(id, hasPlayFn), {
                    id: "example-page--logged-in"
                  });
                } catch (err) {
                  if (err.toString().includes('Execution context was destroyed')) {
                    throw err;
                  } else {
                    await globalThis.__sbPostVisit(page, {
                      ...context,
                      hasFailure: true
                    });
                    throw err;
                  }
                }
                if (globalThis.__sbPostVisit) {
                  await globalThis.__sbPostVisit(page, context);
                }
                if (globalThis.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: "\${"Example/Page"}/\${"Logged In"}". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });",
        }
      `);
    });
  });
});

describe('unsupported index', () => {
  it('throws an error for unsupported versions', () => {
    const unsupportedVersion = { v: 1 } satisfies UnsupportedVersion;
    expect(() => transformPlaywrightJson(unsupportedVersion)).toThrowError(
      `Unsupported version ${unsupportedVersion.v}`
    );
  });
});

describe('makeDescribe', () => {
  it('should generate a skipped describe block with a no-op test when stmts is empty', () => {
    const title = 'Test Title';
    const stmts: t.Statement[] = []; // Empty array

    const result = makeDescribe(title, stmts);

    // Create the expected AST manually for a skipped describe block with a no-op test
    const noOpIt = t.expressionStatement(
      t.callExpression(t.identifier('it'), [
        t.stringLiteral('no-op'),
        t.arrowFunctionExpression([], t.blockStatement([])),
      ])
    );

    const expectedAST = t.expressionStatement(
      t.callExpression(t.memberExpression(t.identifier('describe'), t.identifier('skip')), [
        t.stringLiteral(title),
        t.arrowFunctionExpression([], t.blockStatement([noOpIt])),
      ])
    );

    // Compare the generated AST with the expected AST
    expect(result).toEqual(expectedAST);
  });
});
