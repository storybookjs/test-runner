import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, within, waitFor, userEvent, waitForElementToBeRemoved } from 'storybook/test';

import { isTestRunner } from '../../.storybook/is-test-runner';

import { Button } from './Button';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    primary: false,
  },
  parameters: {
    tests: {
      disableSnapshots: true,
    },
  },
};

export const Demo = {
  render: (args) => (
    <button type="button" onClick={() => args.onSubmit('clicked')}>
      Click
    </button>
  ),
  args: {
    onSubmit: fn(),
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.stringMatching(/([A-Z])\w+/gi));
  },
};

export const FindBy = {
  render: () => {
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
      setTimeout(() => setIsLoading(false), 500);
    }, []);
    return isLoading ? <div>Loading...</div> : <button type="button">Loaded!</button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('button');
    await expect(true).toBe(true);
  },
};

export const WaitFor = {
  render: (args) => (
    <button type="button" onClick={() => setTimeout(() => args.onSubmit('clicked'), 100)}>
      Click
    </button>
  ),
  args: Demo.args,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByText('Click'));
    await waitFor(async () => {
      await expect(args.onSubmit).toHaveBeenCalledWith(expect.stringMatching(/([A-Z])\w+/gi));
      await expect(true).toBe(true);
    });
  },
};

export const WaitForElementToBeRemoved = {
  render: () => {
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
      setTimeout(() => setIsLoading(false), 1500);
    }, []);
    return isLoading ? <div>Loading...</div> : <button type="button">Loaded!</button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitForElementToBeRemoved(await canvas.findByText('Loading...'), { timeout: 2000 });
    const button = await canvas.findByText('Loaded!');
    await expect(button).not.toBeNull();
  },
};

export const WithLoaders = {
  render: (args, { loaded: { todo } }) => {
    return (
      <button type="button" onClick={args.onSubmit(todo.title)}>
        Todo: {todo.title}
      </button>
    );
  },
  args: Demo.args,
  loaders: [
    async () => {
      // long fake timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        todo: {
          userId: 1,
          id: 1,
          title: 'delectus aut autem',
          completed: false,
        },
      };
    },
  ],

  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const todoItem = await canvas.findByText('Todo: delectus aut autem');
    await userEvent.click(todoItem);
    await expect(args.onSubmit).toHaveBeenCalledWith('delectus aut autem');
  },
};

export const UserAgent = {
  render: () => (
    <div>
      <p>
        <strong>isTestRunner:</strong> {isTestRunner().toString()}
      </p>
      <p>
        <strong>User agent:</strong> {window.navigator.userAgent}
      </p>
    </div>
  ),

  play: async () => {
    if (isTestRunner()) {
      await expect(window.navigator.userAgent).toContain('StorybookTestRunner');
    }
  },

  parameters: {
    tests: {
      skip: true,
      disableSnapshots: true,
    },
  },
};
