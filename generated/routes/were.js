'use strict';

const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap


const wereController = require('../controllers/wereController');


router.get('/were/', (req, res, next) => {
  wereController.index(req, res, next);
});

router.get('/were/new', (req, res, next) => {
  wereController.new(req, res, next);
});

router.get('/were/:id', (req, res, next) => {
  wereController.show(req, res, next);
});

router.get('/were/:id/edit', (req, res, next) => {
  wereController.edit(req, res, next);
});

router.get('/were/:id/edit', (req, res, next) => {
  wereController.edit(req, res, next);
});

router.post('/were/new', (req, res, next) => {
  wereController.create(req, res, next);
});

router.put('/were/:id/edit', (req, res, next) => {
  wereController.update(req, res, next);
});

router.delete('/were/:id', (req, res, next) => {
  wereController.delete(req, res, next);
});


module.exports = router;
