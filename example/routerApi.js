

const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap

const { Middleware } = require('chinchay');
const $CONTROLLERNAME$ = require('$ROUTE2CTRL$');


// CREATE

router.post('/api/$TABLE_NAME$/new', $THEWALLAPI$(req, res, next) => {
  $CONTROLLERNAME$.create(req, res, next);
});

router.get('/api/$TABLE_NAME$/template', $THEWALLAPI$(req, res, next) => {
  $CONTROLLERNAME$.template(req, res, next);
});

// READ

router.get('/api/$TABLE_NAME$/find', $THEWALLAPI$(req, res, next) => {
  $CONTROLLERNAME$.find(req, res, next);
});

router.get('/api/$TABLE_NAME$/count', $THEWALLAPI$(req, res, next) => {
  $CONTROLLERNAME$.count(req, res, next);
});

router.get('/api/$TABLE_NAME$/:id', $THEWALLAPI$(req, res, next) => {
  $CONTROLLERNAME$.findById(req, res, next);
});

// UPDATE

router.put('/api/$TABLE_NAME$/:id/edit', $THEWALLAPI$(req, res, next) => {
  $CONTROLLERNAME$.update(req, res, next);
});

router.post('/api/$TABLE_NAME$/:id/edit', $THEWALLAPI$(req, res, next) => {
  $CONTROLLERNAME$.update(req, res, next);
});

router.patch('/api/$TABLE_NAME$/:id/edit', $THEWALLAPI$(req, res, next) => {
  $CONTROLLERNAME$.update(req, res, next);
});

// DELETE

router.delete('/api/$TABLE_NAME$/:id', $THEWALLAPI$(req, res, next) => {
  $CONTROLLERNAME$.delete(req, res, next);
});


module.exports = router;
