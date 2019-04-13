
import React from 'react';
import { shallow } from 'enzyme';
import { Graph } from './linegraph'

it('renders without crashing', () => {
  shallow(<Graph />);
});
