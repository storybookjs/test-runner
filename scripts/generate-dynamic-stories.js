const fs = require('fs')

const storiesFolderPath = 'stories/stress-test'

if (!fs.existsSync(storiesFolderPath)){
  fs.mkdirSync(storiesFolderPath)
}

const storiesAmount = Number(process.env.STORIES_AMOUNT) || 500

let content = `
import React from 'react';

import { Button } from '../basic/Button';

export default {
  title: 'StressTest',
  component: Button,
};
`
for(let i = 0; i < storiesAmount; i++) {
  content += `
  export const Button${i} = {
    args: {
      label: 'I am button #${i}'
    }
  };
  `
}

fs.writeFileSync(`${storiesFolderPath}/StressTest.stories.js`, content, { encoding: 'utf-8' })