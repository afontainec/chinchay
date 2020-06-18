const path = require('path');
const { httpResponse } = require('codemaster');
const { Table, ErrorHandler } = require('chinchay');
const HateoasGenerator = require('chinchay').Hateoas;
const $MODELNAME$ = require('$CTRL2MODELPATH$');

const errorHandler = new ErrorHandler();

const viewPath = '$CTRL2VIEWPATH$';


const newElement = (req, res) => {
  $MODELNAME$.new().then((result) => {
    delete result.id;
    delete result.created_at;
    delete result.updated_at;
    res.render(path.join(viewPath, 'create.ejs'), {
      result,
    });
  }).catch((error) => {
    res.render(path.join(viewPath, 'create.ejs'), {
      error,
      result: {},
    });
  });
};

const show = (req, res) => {
  $MODELNAME$.findById(req.params.id).then((result) => {
    res.render(path.join(viewPath, 'show.ejs'), {
      result,
    });
  }).catch((error) => {
    res.render(path.join(viewPath, 'show.ejs'), {
      error,
      result: {},
    });
  });
};

const index = (req, res) => {
  $MODELNAME$.find().then((results) => {
    res.render(path.join(viewPath, 'index.ejs'), {
      results,
    });
  }).catch((error) => {
    res.render(path.join(viewPath, 'index.ejs'), {
      error,
      results: [],
    });
  });
};

const edit = (req, res) => {
  $MODELNAME$.findById(req.params.id).then((result) => {
    res.render(path.join(viewPath, 'edit.ejs'), {
      result,
    });
  }).catch((error) => {
    res.render(path.join(viewPath, 'edit.ejs'), {
      error,
      result: {},
    });
  });
};

// //////////// API ///////////////

const HATEOAS = new HateoasGenerator();
initializeHATEOAS();

function initializeHATEOAS() {
  HATEOAS.addLink('self', '/api/$TABLE_NAME$/:id');
  HATEOAS.addLink('edit', '/api/$TABLE_NAME$/:id/edit', 'POST');
  HATEOAS.addLink('delete', '/api/$TABLE_NAME$/:id/delete', 'DELETE');
  HATEOAS.addLink('new', '/api/$TABLE_NAME$/new', 'POST');
  HATEOAS.addLink('all', '/api/$TABLE_NAME$/find');
  HATEOAS.addLink('count', '/api/$TABLE_NAME$/count');
}

const create = (req, res) => {
  $MODELNAME$.save(req.body).then((results) => {
    const json = httpResponse.success('Elemento guardado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};

const template = (req, res) => {
  $MODELNAME$.new().then((result) => {
    delete result.id;
    delete result.created_at;
    delete result.updated_at;
    const json = httpResponse.success('Elemento de template', 'data', result);
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};

const update = (req, res) => {
  const id = parseInt(req.params.id, 10);
  $MODELNAME$.update(id, req.body).then((results) => {
    const json = httpResponse.success('Elemento actualizado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};

const del = (req, res) => {
  $MODELNAME$.delete(req.params.id).then((results) => {
    const json = httpResponse.success('Elemento eliminado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};


const find = (req, res) => {
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  const query = Table.extractSearch(req.query);
  $MODELNAME$.find(query, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    for (let i = 0; i < json.data.length; i++) {
      json.data[i].links = HATEOAS.get(json.data[i]);
    }
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};

const findById = (req, res) => {
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  $MODELNAME$.findById(req.params.id, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};

const count = (req, res) => {
  const options = Table.extractOptions(req.query);
  const query = Table.extractSearch(req.query);
  $MODELNAME$.count(query, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    return res.status(200).send(json);
  }).catch((error) => {
    const code = errorHandler.getHTTPCode(error);
    const message = errorHandler.getHTTPMessage(error);
    const json = httpResponse.error(message, error, code);
    return res.status(code).send(json);
  });
};


module.exports = {
  new: newElement,
  template,
  show,
  index,
  edit,
  create,
  find,
  findById,
  count,
  update,
  delete: del,
};
