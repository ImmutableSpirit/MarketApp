const marketDataService = require('../services/marketDataService');

exports.subscribeToTicker = async (req, res) => {
  const { ticker } = req.params;
  const userId = req.user.id;
  console.log(`Subscribing to ticker: ${ticker} for user: ${userId}`);
  
  const callback = (data) => {
    console.log(`Emitting data for ${ticker}:`, data);
    req.app.io.emit(`tickerUpdate:${ticker}`, data);
  };

  marketDataService.subscribeTicker(ticker, callback);

  try {
    // Add the ticker to the database
    await marketDataService.addTickerToDatabase(userId, ticker);
    res.json({ message: `Subscribed to ${ticker}` });
  } catch (error) {
    console.error('Error subscribing to ticker:', error);
    res.status(500).json({ message: 'Error subscribing to ticker' });
  }
};

exports.unsubscribeFromTicker = async (req, res) => {
  const { ticker } = req.params;
  const userId = req.user.id;
  console.log(`Unsubscribing from ticker: ${ticker} for user: ${userId}`);
  
  marketDataService.unsubscribeTicker(ticker);

  try {
    // Remove the ticker from the database
    await marketDataService.removeTickerFromDatabase(userId, ticker);
    res.json({ message: `Unsubscribed from ${ticker}` });
  } catch (error) {
    console.error('Error unsubscribing from ticker:', error);
    res.status(500).json({ message: 'Error unsubscribing from ticker' });
  }
};

exports.addTicker = async (req, res) => {
  const { ticker } = req.params;
  const userId = req.user.id;
  console.log(`Adding ticker: ${ticker} for user: ${userId}`);

  try {
    await marketDataService.addTickerToDatabase(userId, ticker);
    res.json({ message: `Added ${ticker} to watchlist` });
  } catch (error) {
    console.error('Error adding ticker:', error);
    res.status(500).json({ message: 'Error adding ticker to watchlist' });
  }
};

exports.removeTicker = async (req, res) => {
  const { ticker } = req.params;
  const userId = req.user.id;
  console.log(`Removing ticker: ${ticker} for user: ${userId}`);

  try {
    await marketDataService.removeTickerFromDatabase(userId, ticker);
    res.json({ message: `Removed ${ticker} from watchlist` });
  } catch (error) {
    console.error('Error removing ticker:', error);
    res.status(500).json({ message: 'Error removing ticker from watchlist' });
  }
};

exports.getUserTickers = async (req, res) => {
  const userId = req.user.id;
  try {
    const tickers = await marketDataService.getUserTickersFromDatabase(userId);
    res.json({ tickers });
  } catch (error) {
    console.error('Error fetching user tickers:', error);
    res.status(500).json({ message: 'Error fetching user tickers' });
  }
};