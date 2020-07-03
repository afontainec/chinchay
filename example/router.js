

const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap

const { Middleware } = require('chinchay');
const $CONTROLLERNAME$ = require('$ROUTE2CTRL$');


router.get('/$TABLE_NAME$/', $MIDDLEWAREFRONTEND$(req, res, next) => {
  $CONTROLLERNAME$.index(req, res, next);
});

router.get('/$TABLE_NAME$/new', $MIDDLEWAREFRONTEND$(req, res, next) => {
  $CONTROLLERNAME$.new(req, res, next);
});

router.get('/$TABLE_NAME$/:id', $MIDDLEWAREFRONTEND$(req, res, next) => {
  $CONTROLLERNAME$.show(req, res, next);
});

router.get('/$TABLE_NAME$/:id/edit', $MIDDLEWAREFRONTEND$(req, res, next) => {
  $CONTROLLERNAME$.edit(req, res, next);
});


module.exports = router;
