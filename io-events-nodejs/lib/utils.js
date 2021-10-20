module.exports = {
  resToJSON: res => {
    return {
      status: res.status,
      statusText: res.statusText,
      data: res.data
    };
  },
  errorToJSON: err => {
    if (err.response) {
      return {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data
      };
    } else {
      return {
        status: err.name,
        statusText: err.message,
        data: err.stack
      }
    }
  }
};
