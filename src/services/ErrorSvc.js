export default {
  getError(e) {
    if (typeof e.response !== 'undefined') {
      switch (e.response.status) {
        case 400:
          return e.response.data.message
            ? e.response.data.message : e.response.data.error;
        case 401:
          return e.response.data.message
            ? e.response.data.message : e.response.data.error;
        case 404:
          return e.response.data.message;
        case 406:
          return 'File not found';
        case 409:
          return e.response.data.message;
        case 500:
          return e.response.data.message
            ? e.response.data.message : e.response.data.error;
        default:
          // Unhandled Exception
          return e;
      }
    }
    return 'Please Check your Internet Connection';
  },
};
