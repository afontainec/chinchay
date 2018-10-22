
const Printer = require('./printer');
const Model = require('./model');

const newMVC = (table_name) => {
  if (typeof table_name !== 'string') {
    return Printer.error('Not valid model name');
  }
  Model.createFile(table_name);
  // Controller.createFile(table_name);
};

module.exports = { new: newMVC };
