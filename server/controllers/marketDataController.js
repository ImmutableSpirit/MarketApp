const marketDataService = require('../services/marketDataService');

exports.subscribeToTicker = (req, res) => {
  const { ticker } = req.params;
  console.log(`Subscribing to ticker: ${ticker}`);
  const callback = (data) => {
    console.log(`Emitting data for ${ticker}:`, data);
    req.app.io.emit(`tickerUpdate:${ticker}`, data);
  };

  marketDataService.subscribeTicker(ticker, callback);
  
  res.json({ message: `Subscribed to ${ticker}` });
};

exports.unsubscribeFromTicker = (req, res) => {
  const { ticker } = req.params;
  console.log(`Unsubscribing from ticker: ${ticker}`);
  marketDataService.unsubscribeTicker(ticker);
  
  res.json({ message: `Unsubscribed from ${ticker}` });
};