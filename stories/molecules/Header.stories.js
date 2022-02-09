import React from 'react';

import { Header } from './Header';

export default {
  component: Header,
  play: async () => {},
};

const Template = (args) => <Header {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
