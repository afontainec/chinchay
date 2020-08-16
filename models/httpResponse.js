
exports.success = (text, keys, values) => {
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

exports.error = function buildErrorJSON(error, fullMessage, code) {
  if (code === 500) error = 'Internal Server Error';
  const json = { error };
  const environment = process.env.NODE_ENV || 'development';
  if (environment !== 'production') {
    json.fullError = fullMessage;
  }
  return json;
};
