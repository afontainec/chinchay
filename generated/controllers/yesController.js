
const Yes = require('../models/yes');
const path = require('path');
const httpResponse = require('../../services/httpResponse');
const Table = require('../../services/models/tableGateway/table');

const viewPath = '$VIEWPATH$';

const newElement = (req, res) => {
  Yes.new().then((results) => {
    res.render(path.join(viewPath, 'create.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath, 'create.ejs'), { error, results: [] });
  });
};

const show = (req, res) => {
  Yes.findById(req.params.id).then((results) => {
    res.render(path.join(viewPath, 'show.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath, 'show.ejs'), { error, results: [] });
  });
};

const index = (req, res) => {
  Yes.find().then((results) => {
    res.render(path.join(viewPath, 'index.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath, 'index.ejs'), { error, results: [] });
  });
};

const edit = (req, res) => {
  Yes.findById(req.params.id).then((results) => {
    res.render(path.join(viewPath, 'show.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath, 'show.ejs'), { error, results: [] });
  });
};

// //////////// API ///////////////

const create = (req, res) => {
  Yes.save(req.query).then((results) => {
    const json = httpResponse.success('Elemento guardado exitosamente', 'data', results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const find = (req, res) => {
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  Yes.find(req.query, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const count = (req, res) => {
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  Yes.find(req.query, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const update = (req, res) => {
  Yes.update(req.params.id, req.query).then((results) => {
    const json = httpResponse.success('Elemento actualizado exitosamente', 'data', results);
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
