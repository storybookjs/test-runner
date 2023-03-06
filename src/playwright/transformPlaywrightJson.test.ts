import { transformPlaywrightJson } from './transformPlaywrightJson';

describe('Playwright Json', () => {
  describe('v4 indexes', () => {
    it('should generate a test for each story', () => {
      const input = {
        v: 4,
        entries: {
          'example-header--logged-in': {
            id: 'example-header--logged-in',
            title: 'Example/Header',
            name: 'Logged In',
            importPath: './stories/basic/Header.stories.js',
          },
          'example-header--logged-out': {
            id: 'example-header--logged-out',
            title: 'Example/Header',
            name: 'Logged Out',
            importPath: './stories/basic/Header.stories.js',
          },
          'example-page--logged-in': {
            id: 'example-page--logged-in',
            title: 'Example/Page',
            name: 'Logged In',
            importPath: './stories/basic/Page.stories.js',
          },
        },
      };
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        Object {
          "example-header": "describe(\\"Example/Header\\", () => {
          describe(\\"Logged In\\", () => {
            it(\\"test\\", async () => {
              const testFn = async () => {
                const context = {
                  id: \\"example-header--logged-in\\",
                  title: \\"Example/Header\\",
                  name: \\"Logged In\\"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: \\"example-header--logged-in\\",
                    err: err.message
                  });
                });
                if (globalThis.__sbPreRender) {
                  await globalThis.__sbPreRender(page, context);
                }
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: \\"example-header--logged-in\\"
                });
                if (globalThis.__sbPostRender) {
                  await globalThis.__sbPostRender(page, context);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: \\"\${\\"Example/Header\\"}/\${\\"Logged In\\"}\\". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
          describe(\\"Logged Out\\", () => {
            it(\\"test\\", async () => {
              const testFn = async () => {
                const context = {
                  id: \\"example-header--logged-out\\",
                  title: \\"Example/Header\\",
                  name: \\"Logged Out\\"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: \\"example-header--logged-out\\",
                    err: err.message
                  });
                });
                if (globalThis.__sbPreRender) {
                  await globalThis.__sbPreRender(page, context);
                }
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: \\"example-header--logged-out\\"
                });
                if (globalThis.__sbPostRender) {
                  await globalThis.__sbPostRender(page, context);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: \\"\${\\"Example/Header\\"}/\${\\"Logged Out\\"}\\". Retrying...\`);
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
          "example-page": "describe(\\"Example/Page\\", () => {
          describe(\\"Logged In\\", () => {
            it(\\"test\\", async () => {
              const testFn = async () => {
                const context = {
                  id: \\"example-page--logged-in\\",
                  title: \\"Example/Page\\",
                  name: \\"Logged In\\"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: \\"example-page--logged-in\\",
                    err: err.message
                  });
                });
                if (globalThis.__sbPreRender) {
                  await globalThis.__sbPreRender(page, context);
                }
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: \\"example-page--logged-in\\"
                });
                if (globalThis.__sbPostRender) {
                  await globalThis.__sbPostRender(page, context);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: \\"\${\\"Example/Page\\"}/\${\\"Logged In\\"}\\". Retrying...\`);
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
            importPath: './stories/basic/Introduction.stories.mdx',
          },
          'example-page--logged-in': {
            id: 'example-page--logged-in',
            title: 'Example/Page',
            name: 'Logged In',
            importPath: './stories/basic/Page.stories.js',
          },
        },
      };
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        Object {
          "example-page": "describe(\\"Example/Page\\", () => {
          describe(\\"Logged In\\", () => {
            it(\\"test\\", async () => {
              const testFn = async () => {
                const context = {
                  id: \\"example-page--logged-in\\",
                  title: \\"Example/Page\\",
                  name: \\"Logged In\\"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: \\"example-page--logged-in\\",
                    err: err.message
                  });
                });
                if (globalThis.__sbPreRender) {
                  await globalThis.__sbPreRender(page, context);
                }
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: \\"example-page--logged-in\\"
                });
                if (globalThis.__sbPostRender) {
                  await globalThis.__sbPostRender(page, context);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: \\"\${\\"Example/Page\\"}/\${\\"Logged In\\"}\\". Retrying...\`);
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
            importPath: './stories/basic/Header.stories.js',
            kind: 'Example/Header',
            story: 'Logged In',
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
            importPath: './stories/basic/Header.stories.js',
            kind: 'Example/Header',
            story: 'Logged Out',
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
            importPath: './stories/basic/Page.stories.js',
            kind: 'Example/Page',
            story: 'Logged In',
            parameters: {
              __id: 'example-page--logged-in',
              docsOnly: false,
              fileName: './stories/basic/Page.stories.js',
            },
          },
        },
      };
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        Object {
          "example-header": "describe(\\"Example/Header\\", () => {
          describe(\\"Logged In\\", () => {
            it(\\"test\\", async () => {
              const testFn = async () => {
                const context = {
                  id: \\"example-header--logged-in\\",
                  title: \\"Example/Header\\",
                  name: \\"Logged In\\"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: \\"example-header--logged-in\\",
                    err: err.message
                  });
                });
                if (globalThis.__sbPreRender) {
                  await globalThis.__sbPreRender(page, context);
                }
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: \\"example-header--logged-in\\"
                });
                if (globalThis.__sbPostRender) {
                  await globalThis.__sbPostRender(page, context);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: \\"\${\\"Example/Header\\"}/\${\\"Logged In\\"}\\". Retrying...\`);
                  await jestPlaywright.resetPage();
                  await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
          describe(\\"Logged Out\\", () => {
            it(\\"test\\", async () => {
              const testFn = async () => {
                const context = {
                  id: \\"example-header--logged-out\\",
                  title: \\"Example/Header\\",
                  name: \\"Logged Out\\"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: \\"example-header--logged-out\\",
                    err: err.message
                  });
                });
                if (globalThis.__sbPreRender) {
                  await globalThis.__sbPreRender(page, context);
                }
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: \\"example-header--logged-out\\"
                });
                if (globalThis.__sbPostRender) {
                  await globalThis.__sbPostRender(page, context);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: \\"\${\\"Example/Header\\"}/\${\\"Logged Out\\"}\\". Retrying...\`);
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
          "example-page": "describe(\\"Example/Page\\", () => {
          describe(\\"Logged In\\", () => {
            it(\\"test\\", async () => {
              const testFn = async () => {
                const context = {
                  id: \\"example-page--logged-in\\",
                  title: \\"Example/Page\\",
                  name: \\"Logged In\\"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: \\"example-page--logged-in\\",
                    err: err.message
                  });
                });
                if (globalThis.__sbPreRender) {
                  await globalThis.__sbPreRender(page, context);
                }
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: \\"example-page--logged-in\\"
                });
                if (globalThis.__sbPostRender) {
                  await globalThis.__sbPostRender(page, context);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: \\"\${\\"Example/Page\\"}/\${\\"Logged In\\"}\\". Retrying...\`);
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
            importPath: './stories/basic/Introduction.stories.mdx',
            kind: 'Example/Introduction',
            story: 'Page',
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
            importPath: './stories/basic/Page.stories.js',
            kind: 'Example/Page',
            story: 'Logged In',
            parameters: {
              __id: 'example-page--logged-in',
              docsOnly: false,
              fileName: './stories/basic/Page.stories.js',
            },
          },
        },
      };
      expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
        Object {
          "example-page": "describe(\\"Example/Page\\", () => {
          describe(\\"Logged In\\", () => {
            it(\\"test\\", async () => {
              const testFn = async () => {
                const context = {
                  id: \\"example-page--logged-in\\",
                  title: \\"Example/Page\\",
                  name: \\"Logged In\\"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: \\"example-page--logged-in\\",
                    err: err.message
                  });
                });
                if (globalThis.__sbPreRender) {
                  await globalThis.__sbPreRender(page, context);
                }
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: \\"example-page--logged-in\\"
                });
                if (globalThis.__sbPostRender) {
                  await globalThis.__sbPostRender(page, context);
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
                  console.log(\`An error occurred in the following story, most likely because of a navigation: \\"\${\\"Example/Page\\"}/\${\\"Logged In\\"}\\". Retrying...\`);
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
