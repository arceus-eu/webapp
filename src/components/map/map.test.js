import React from 'react';
import { shallow } from 'enzyme';
import Map from './map'

it('renders without crashing', () => {
  shallow(<Map />);
});
