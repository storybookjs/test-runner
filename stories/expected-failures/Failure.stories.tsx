import React from 'react';
import { within, userEvent } from 'storybook/test';

import { Page } from '../pages/Page';

export default {
  title: 'Stories with failures',
  component: Page,
};

export const ComponentLogsErrors = () => {
  console.error('Console error with a failure');
  return <div>Hello world</div>;
};

export const ComponentThrowsErrors = () => {
  throw new Error('Component has a failure');
};

export const PlayFnThrowsErrors = {
  play: () => {
    throw new Error('Play function has a failure');
  },
};

export const PlayFnAssertionFails = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const unexistentButton = await canvas.getByRole('button', { name: /I do not exist/i });
    await userEvent.click(unexistentButton);
  },
};
