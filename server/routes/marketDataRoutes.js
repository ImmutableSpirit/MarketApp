const express = require('express');
const router = express.Router();
const marketDataController = require('../controllers/marketDataController');

router.post('/subscribe/:ticker', marketDataController.subscribeToTicker);
router.post('/unsubscribe/:ticker', marketDataController.unsubscribeFromTicker);

module.exports = router;