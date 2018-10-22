

const newMessage = (code, message, fullMessage) => {
  return {
    code,
    message,
    fullMessage,
  };
};


const isError = function (message) {
  const code = message.code;
  return (code >= 400);
};

const isServerError = function (message) {
  const code = message.code;
  return (code === 500);
};

const isClientError = function (message) {
  return !isServerError(message);
};

module.exports = {
  new: newMessage,
  isError,
  isServerError,
  isClientError,
};
