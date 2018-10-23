const path = require('path');

exports.success = function (text, keys, values) {
  const json = {
    message: text,
  };

  if (Object.prototype.toString.call(keys) === '[object Array]') {
    for (let i = 0; i < keys.length; i++) {
      json[keys[i]] = values[i];
    }
  } else {
    json[keys] = values;
  }
  return json;
};

exports.error = function buildErrorJSON(error, fullMessage) {
  const json = {
    error,
  };
  const environment = process.env.NODE_ENV || 'development';
  if (environment !== 'production') {
    json.fullError = fullMessage;
  }
  return json;
};

exports.errorPath = function () {
  return path.join(__dirname, '../', '../', 'client', 'views', 'error.ejs');
};
