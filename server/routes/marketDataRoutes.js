const express = require('express');
const router = express.Router();
const marketDataController = require('../controllers/marketDataController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/subscribe/:ticker', authenticateToken, marketDataController.subscribeToTicker);
router.post('/unsubscribe/:ticker', authenticateToken, marketDataController.unsubscribeFromTicker);
router.post('/addTicker/:ticker', authenticateToken, marketDataController.addTicker);
router.post('/removeTicker/:ticker', authenticateToken, marketDataController.removeTicker);
router.get('/tickers', authenticateToken, marketDataController.getUserTickers);

module.exports = router;