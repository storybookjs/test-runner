import fs from 'fs-extra';
import path from 'path';
import globby from 'globby';
import { transformPlaywright } from './playwright/transformPlaywright';

export const transformAll = async (targetDir: string) => {
  const files = await globby(['**/*.stories.*', '!**/node_modules', '!**/dist']);
  const cwd = process.cwd();
  const outputDir = path.join(cwd, targetDir);

  console.log(`=> Applying transform: ${files.length} files into ${outputDir}`);

  await Promise.all(
    files.map(async (filename: string) => {
      const src = await fs.readFile(filename, 'utf8');
      const transformed = transformPlaywright(src);
      const output = path.join(outputDir, filename.replace('.stories.', '.spec.'));
      await fs.ensureDir(path.dirname(output));

      console.log('transforming', { filename, output });

      await fs.writeFile(output, transformed);
    })
  );
};

transformAll('./node_modules/@storybook/test-runner/specs').then(() => console.log('done'));
