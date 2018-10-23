'use strict';

const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap


const wereController = require('../controllers/wereController');


router.get('/were/find', (req, res, next) => {
  wereController.index(req, res, next);
});

router.get('/were/:id', (req, res, next) => {
  wereController.findById(req, res, next);
});

router.get('/were/count', (req, res, next) => {
  wereController.edit(req, res, next);
});


module.exports = router;
