//@ts-nocheck
const sanitizeURL = (url) => {
  let finalURL = url;
  // prepend URL protocol if not there
  if (finalURL.indexOf('http://') === -1 && finalURL.indexOf('https://') === -1) {
    finalURL = 'http://' + finalURL;
  }

  // remove iframe.html if present
  finalURL = finalURL.replace(/iframe.html\s*$/, '');

  // add forward slash at the end if not there
  if (finalURL.slice(-1) !== '/') {
    finalURL = finalURL + '/';
  }

  return finalURL;
};

export const setupPage = async (page) => {
  const start = new Date();
  const targetURL = sanitizeURL(process.env.TARGET_URL || `http://localhost:6006`);

  const referenceURL = process.env.REFERENCE_URL && sanitizeURL(process.env.REFERENCE_URL);

  if ('TARGET_URL' in process.env && !process.env.TARGET_URL) {
    console.log(
      `Received TARGET_URL but with a falsy value: ${process.env.TARGET_URL}, will fallback to ${targetURL} instead.`
    );
  }

  await page.goto(`${targetURL}iframe.html`, { waitUntil: 'load' }).catch((err) => {
    if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
      const errorMessage = `Could not access the Storybook instance at ${targetURL}. Are you sure it's running?\n\n${err.message}`;
      throw new Error(errorMessage);
    }

    throw err;
  }); // FIXME: configure
  console.log(`page loaded in ${new Date() - start}ms.`);

  // if we ever want to log something from the browser to node -- helps debugging
  await page.exposeBinding('logToPage', (_, message) => console.log(message));
  await page.exposeBinding('throwError', (_, message) => {
    throw new Error(message);
  });

  await page.addScriptTag({
    content: `
      class StorybookTestRunnerError extends Error {
        constructor(storyId, errorMessage) {
          super(errorMessage);
          this.name = 'StorybookTestRunnerError';
          const storyUrl = \`${referenceURL || targetURL}?path=/story/\${storyId}\`;
          const finalStoryUrl = \`\${storyUrl}&addonPanel=storybook/interactions/panel\`;

          this.message = \`\nAn error occurred in the following story:\n\${finalStoryUrl}\n\nMessage:\n \${errorMessage}\`;
        }
      }

      const bold = (message) => \`\\u001b[1m\${message}\\u001b[22m\`;
      const magenta = (message) => \`\\u001b[35m\${message}\\u001b[39m\`;
      const blue = (message) => \`\\u001b[34m\${message}\\u001b[39m\`;
      const red = (message) => \`\\u001b[31m\${message}\\u001b[39m\`;
      const yellow = (message) => \`\\u001b[33m\${message}\\u001b[39m\`;

      async function __throwError(storyId, errorMessage) {
        throw new StorybookTestRunnerError(storyId, errorMessage);
      }

      async function __waitForElement(selector) {
        return new Promise((resolve, reject) => {

          const timeout = setTimeout(() => {
            reject();
          }, 10000);

          if (document.querySelector(selector)) {
            clearTimeout(timeout);
            return resolve(document.querySelector(selector));
          }

          const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
              clearTimeout(timeout);
              resolve(document.querySelector(selector));
              observer.disconnect();
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        });
      }

      function checkViolations(results, storyId) {
        const filterViolations = (violations, impactLevels) => {
          if (impactLevels && impactLevels.length > 0) {
            return violations.filter((v) => impactLevels.includes(v.impact));
          }
          return violations;
        }
      
        const violations = filterViolations(
          results.violations,
          results.toolOptions ? results.toolOptions.impactLevels : []
        )
        
        const reporter = (violations) => {
          if (violations.length === 0) {
            return [];
          }

          const lineBreak = '\\n\\n';
          const horizontalLine = '\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500';
          let violationNumber = 0
          return violations
            .map((violation) => {
              const errorBody = violation.nodes
                .map((node) => {
                  violationNumber++;
                  const selector = node.target.join(', ');
                  const expectedText = \`Expected the HTML found at $('\${selector}') to have no violations:\` + lineBreak;
                  return (
                    bold(expectedText) +
                    node.html +
                    lineBreak +
                    'Received:' +
                    lineBreak +
                    red(\`\${violation.help} (\${violation.id})\`) +
                    lineBreak +
                    yellow(node.failureSummary) +
                    lineBreak +
                    (violation.helpUrl
                      ? \`You can find more information on this issue here: \\n\${bold(blue(violation.helpUrl))}\`
                      : '') + '\\n----------------------------------'
                  )
                })
                .join(lineBreak)

              return \`Found \${violationNumber} accessibility violations:\\n\\n----------------------------------\\n \${errorBody}\`
            })
            .join(lineBreak + horizontalLine + lineBreak);
        }
        
        const formattedViolations = reporter(violations);
        const pass = formattedViolations.length === 0;
      
        const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
        if (!pass) {
          channel.emit('endReports', formattedViolations);
        } else {
          channel.emit('endReports');
        }
      }

      async function __test(storyId) {
        try {
          await __waitForElement('#root');
        } catch(err) {
          const message = \`Timed out waiting for Storybook to load after 10 seconds. Are you sure the Storybook is running correctly in that URL? Is the Storybook private (e.g. under authentication layers)?\n\n\nHTML: \${document.body.innerHTML}\`;
          throw new StorybookTestRunnerError(storyId, message);
        }

        const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
        if(!channel) {
          throw new StorybookTestRunnerError(
            storyId,
            'The test runner could not access the Storybook channel. Are you sure the Storybook is running correctly in that URL?'
          );
        }

        return new Promise((resolve, reject) => {
          channel.on('storybook/a11y/result', (results) => checkViolations(results, storyId));
          channel.on('startReports', () => {
            channel.emit('storybook/a11y/manual', storyId);
          })
          channel.on('endReports', (error) => {
            if(error) {
              reject(error);
            }
            resolve(document.getElementById('root'));
          });
          channel.on('storyRendered', () => {
            channel.emit('startReports');
          });
          channel.on('storyUnchanged', () => resolve(document.getElementById('root')));
          channel.on('storyErrored', ({ description }) => reject(
            new StorybookTestRunnerError(storyId, description))
          );
          channel.on('storyThrewException', (error) => reject(
            new StorybookTestRunnerError(storyId, error.message))
          );
          
          channel.on('storyMissing', (id) => id === storyId && reject(
            new StorybookTestRunnerError(storyId, 'The story was missing when trying to access it.'))
          );

          channel.emit('setCurrentStory', { storyId });
        });
      };
    `,
  });
};
