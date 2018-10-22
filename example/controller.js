
const $MODELNAME$ = require('$MODELPATH$');
const path = require('path');
const viewPath = '$VIEWPATH$';




const new = (req, res) => {
  $MODELNAME$.new().then((results) => {
    res.render(path.join(viewPath,'create.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath,'create.ejs'), { error });
  });
};

const show = (req, res) => {
  $MODELNAME$.findById(req.params.id).then((results) => {
    res.render(path.join(viewPath,'show.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath,'show.ejs'), { error });
  });
};

const index = (req, res) => {
  $MODELNAME$.find().then((results) => {
    res.render(path.join(viewPath,'index.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath,'index.ejs'), { error });
  });
};

const edit = (req, res) => {
  $MODELNAME$.findById(req.params.id).then((results) => {
    res.render(path.join(viewPath,'show.ejs'), { results });
  }).catch((error) => {
    res.render(path.join(viewPath,'show.ejs'), { error });
  });
};

////////////// API ///////////////

const create = (req, res) => {
  $MODELNAME$.save(req.query).then((results) => {
  }).catch((error) => {});
};

const find = (req, res) => {
  $MODELNAME$.find(req.query).then((results) => {
  }).catch((error) => {});
};

const count = (req, res) => {
  $MODELNAME$.find(req.query).then((results) => {
  }).catch((error) => {});
};

const update = (req, res) => {
  $MODELNAME$.update(req.params.id, req.query).then((results) => {
  }).catch((error) => {});
};
