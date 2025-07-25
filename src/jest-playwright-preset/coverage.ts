import * as uuid from 'uuid';
import path from 'node:path';
import fs from 'node:fs';
import type { Page } from 'playwright-core';
import { rimraf } from 'rimraf';
const fsAsync = fs.promises;

// @ts-ignore
import NYC from 'nyc';
import { PACKAGE_NAME } from './constants';

const NYC_DIR = '.nyc_output';
const COV_MERGE_DIR = path.join(NYC_DIR, 'merge');

const cleanMergeFiles = async (): Promise<void> => {
  await rimraf(COV_MERGE_DIR);
};

export const setupCoverage = async (): Promise<void> => {
  if (!fs.existsSync(NYC_DIR)) {
    await fsAsync.mkdir(NYC_DIR);
  }
  await cleanMergeFiles();
  await fsAsync.mkdir(COV_MERGE_DIR);
};

export const saveCoverageToFile = async (coverage: unknown): Promise<void> => {
  await fsAsync.writeFile(path.join(COV_MERGE_DIR, `${uuid.v4()}.json`), JSON.stringify(coverage));
};

export const saveCoverageOnPage = async (page: Page, collectCoverage = false): Promise<void> => {
  if (!collectCoverage) {
    console.warn(
      `${PACKAGE_NAME}: saveCoverage was called but collectCoverage is not true in config file`
    );
    return;
  }
  const coverage = await page.evaluate(`window.__coverage__`);
  if (coverage) {
    await saveCoverageToFile(coverage);
  }
};

export const mergeCoverage = async (): Promise<void> => {
  const nyc = new NYC({
    _: ['merge'],
  });
  const map = await nyc.getCoverageMapFromAllCoverageFiles(COV_MERGE_DIR);
  const outputFile = path.join(NYC_DIR, 'coverage.json');
  const content = JSON.stringify(map, null, 2);
  await fsAsync.writeFile(outputFile, content);
  console.info(`Coverage file (${content.length} bytes) written to ${outputFile}`);
  await cleanMergeFiles();
};
