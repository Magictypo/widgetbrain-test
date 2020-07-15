import axios from 'axios';

export default {
  getData() {
    return axios.get('/torque');
  },
};
