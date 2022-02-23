import React from 'react';

import { Page } from './Page';
import * as HeaderStories from '../molecules/Header.stories';

export default {
  title: 'Pages/Page',
  component: Page,
  play: async () => {},
};

const Template = (args) => <Page {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args,
};
