const $MODELNAME$ = require('$CTRL2MODELPATH$');
const path = require('path');
const httpResponse = require('codemaster').httpResponse;
const Table = require('chinchay').Table;
const HateoasGenerator = require('chinchay').Hateoas;


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
  HATEOAS.addLink('self', '/api/$MODELNAME$/:id');
  HATEOAS.addLink('edit', '/api/$MODELNAME$/:id/edit', 'POST');
  HATEOAS.addLink('delete', '/api/$MODELNAME$/:id/delete', 'DELETE');
  HATEOAS.addLink('new', '/api/$MODELNAME$/new', 'POST');
  HATEOAS.addLink('all', '/api/$MODELNAME$/find');
  HATEOAS.addLink('count', '/api/$MODELNAME$/count');
}

const create = (req, res) => {
  $MODELNAME$.save(req.body).then((results) => {
    const json = httpResponse.success('Elemento guardado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const update = (req, res) => {
  $MODELNAME$.update(req.params.id, req.body).then((results) => {
    const json = httpResponse.success('Elemento actualizado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const del = (req, res) => {
  $MODELNAME$.delele(req.params.id).then((results) => {
    const json = httpResponse.success('Elemento eliminado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};


const find = (req, res) => {
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  $MODELNAME$.find(req.query, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    for (let i = 0; i < json.data.length; i++) {
      json.data[i].links = HATEOAS.get(json.data[i]);
    }
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
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
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const count = (req, res) => {
  const options = Table.extractOptions(req.query);
  $MODELNAME$.count(req.query, options).then((results) => {
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
  findById,
  count,
  update,
  delete: del,
};
