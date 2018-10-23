'use strict';

const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap


const $CONTROLLERNAME$ = require('$ROUTE2CTRL$');


router.get('/$TABLE_NAME$/find', (req, res, next) => {
  $CONTROLLERNAME$.find(req, res, next);
});

router.get('/$TABLE_NAME$/:id', (req, res, next) => {
  $CONTROLLERNAME$.findById(req, res, next);
});

router.get('/$TABLE_NAME$/count', (req, res, next) => {
  $CONTROLLERNAME$.edit(req, res, next);
});


module.exports = router;
