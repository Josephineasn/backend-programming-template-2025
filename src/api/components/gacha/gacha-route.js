const express = require('express');

const gachaController = require('./gacha-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  route.post('/gacha', gachaController.mainGacha);
  route.put('/:userId/gacha', gachaController.mainGacha);

  route.get('/gacha/quota', gachaController.getRemainKuota);
  route.get('/gacha/winners', gachaController.getAllWinners);
  route.get('/:userId/gacha/history', gachaController.getMyHistory);
};
