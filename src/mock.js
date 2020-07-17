import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import torqueResponse from '@/resources/mock/getTorqueProfile.json';

if (process.env.NODE_ENV === 'development') {
  const mock = new MockAdapter(axios);
  mock
    .onGet('/torque')
    .reply(200, torqueResponse);
}
