
const Waba = require('../models/waba');
const path = require('path');
const httpResponse = require('../../services/httpResponse');
const Table = require('../../services/models/tableGateway/table');

const viewPath = '$VIEWPATH$';

const newElement = (req, res) => {
  Waba.new().then((results) => {
    res.render(path.join(viewPath, 'create.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath, 'create.ejs'), { error });
  });
};

const show = (req, res) => {
  Waba.findById(req.params.id).then((results) => {
    res.render(path.join(viewPath, 'show.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath, 'show.ejs'), { error });
  });
};

const index = (req, res) => {
  Waba.find().then((results) => {
    res.render(path.join(viewPath, 'index.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath, 'index.ejs'), { error });
  });
};

const edit = (req, res) => {
  Waba.findById(req.params.id).then((results) => {
    res.render(path.join(viewPath, 'show.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath, 'show.ejs'), { error });
  });
};

// //////////// API ///////////////

const create = (req, res) => {
  Waba.save(req.query).then((results) => {
  }).catch((error) => {});
};

const find = (req, res) => {
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  Waba.find(req.query, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const count = (req, res) => {
  const options = Table.extractOptions(req.query);
  Waba.count(req.query, options).then((results) => {
    const json = httpResponse.success('Elementos contados exitosamente', 'data', results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const find = (req, res) => {
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  Waba.find(req.query, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};


module.exports = {
  new: newElement,
  show,
  index,
  edit,
  create,
  find,
  count,
  update,
};
