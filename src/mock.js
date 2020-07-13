import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import torqueResponse from '@/resources/mock/torque.json';

const mock = new MockAdapter(axios);
const enable = true;

if (process.env.NODE_ENV === 'development' && enable) {
  mock
    .onGet('https://b507qiqddb.execute-api.eu-central-1.amazonaws.com/torque')
    .reply(200, torqueResponse);
}
