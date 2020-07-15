const API_URL = process.env.VUE_APP_API_URL;

const GlobalConfig = {
  API_URL: API_URL || '/api',
};

export default (GlobalConfig);
