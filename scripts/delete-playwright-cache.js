/**
 * IMPORTANT: This script is only necessary because Playwright does not have a flag to disable or clear
 * it's transform cache.
 *
 * Playwright caches the transform plugin from the test-runner, so if you make changes and rebuild,
 * these changes would not be reflected in the test-runner. This script (hooked to nodemon) makes sure that
 * whenever you change the csf-playwright-plugin.ts file, the cache is cleared and you actually get your changes.
 */
const fs = require('fs').promises;
const path = require('path');

const CACHE_FILE = 'playwright-cache-location.txt';

const SEARCH_PATH = '/var/folders/';

const PATTERN = /^playwright-transform-cache-/;

async function directoryExists(dirPath) {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
}

async function getCachedPath() {
  try {
    const path = await fs.readFile(CACHE_FILE, 'utf8');
    if (await directoryExists(path.trim())) {
      return path;
    }
  } catch (error) {}
  return null;
}

async function findPlaywrightTransformCacheDir(dirPath) {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        const fullPath = path.join(dirPath, file.name);
        if (PATTERN.test(file.name)) {
          return fullPath;
        }

        const foundPath = await findPlaywrightTransformCacheDir(fullPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
  } catch (error) {}
  return null;
}

// Find the Playwright transform cache directory and delete it
// This is the pattern used by Playwright: /var/folders/{some-hash}/{some-other-hash}/T/playwright-transform-cache-501
// it will look like this /var/folders/sv/lg8lnv0s4gg6_rt7s6cd52qr0000gn/T/playwright-transform-cache-501
const main = async () => {
  if (process.platform !== 'darwin') {
    throw new Error('This script only works on macOS.');
  }

  let playwrightTransformPath = await getCachedPath();

  if (!playwrightTransformPath) {
    playwrightTransformPath = await findPlaywrightTransformCacheDir(SEARCH_PATH);

    if (playwrightTransformPath) {
      console.log(`📝 Writing the Playwright transform cache location to: ${CACHE_FILE}`);
      await fs.writeFile(CACHE_FILE, playwrightTransformPath);
    }
  }

  if (playwrightTransformPath) {
    console.log(`🚮 Deleting the Playwright transform cache at: ${playwrightTransformPath}`);
    await fs.rm(playwrightTransformPath, { recursive: true });
  } else {
    console.log('No Playwright transform cache to clear yet.');
  }
};

if (process.env.CI === undefined) {
  main();
}
