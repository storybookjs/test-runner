import fs from 'fs-extra';
import replace from 'replace-in-file';

const srcDir = 'src/templates';
const destDir = 'dist/templateFiles';

fs.ensureDirSync(destDir);
fs.copySync(srcDir, destDir);
console.log(`Successfully copied ${srcDir} to ${destDir}`);

const options = {
  files: `${destDir}/**/*`,
  from: '../index',
  to: '@storybook/test-runner',
};

try {
  const results = replace.sync(options);
  console.log(`Replaced ${results.length} instances of '${options.from}' with '${options.to}'`);
} catch (error) {
  console.error('Error occurred:', error);
}
