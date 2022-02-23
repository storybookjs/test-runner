const fs = require('fs');

const storiesFolderPath = 'stories/atoms';

if (!fs.existsSync(storiesFolderPath)) {
  fs.mkdirSync(storiesFolderPath);
}

const storyCount = Number(process.env.DYNAMIC_STORIES_COUNT) || 500;

let content = `
import React from 'react';

import { Button } from './Button';

export default {
  title: 'StressTest',
  component: Button,
};
`;
for (let i = 0; i < storyCount; i++) {
  content += `
  export const Button${i} = {
    args: {
      label: 'I am button #${i}'
    }
  };
  `;
}

fs.writeFileSync(`${storiesFolderPath}/StressTest.stories.js`, content, { encoding: 'utf-8' });
