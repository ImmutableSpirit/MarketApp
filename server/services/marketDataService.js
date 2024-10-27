const WebSocket = require('ws');
const { Ticker } = require('../config/database');

class MarketDataService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
  }

  connect(apiKey) {
    const wsUrl = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${apiKey}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.on('open', () => {
      console.log('WebSocket connection established');
    });

    this.ws.on('message', (data) => {
      const parsedData = JSON.parse(data);
      //console.log("TwelveData reponse: ==============================")
      //console.log(parsedData);
      this.notifySubscribers(parsedData);
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.ws.on('close', () => {
       console.log('WebSocket connection closed');
    });
  }

  subscribeTicker(ticker, callback) {
    if (!this.subscribers.has(ticker)) {
      this.subscribers.set(ticker, new Set());
      this.sendSubscription(ticker);
    }
    this.subscribers.get(ticker).add(callback);
  }

  unsubscribeTicker(ticker, callback) {
    if (this.subscribers.has(ticker)) {
      this.subscribers.get(ticker).delete(callback);
      if (this.subscribers.get(ticker).size === 0) {
        this.subscribers.delete(ticker);
        this.sendUnsubscription(ticker);
      }
    }
  }

  sendSubscription(ticker) {
    const subscribeMessage = {
      action: 'subscribe',
      params: {
        symbols: ticker
      }
    };
    this.ws.send(JSON.stringify(subscribeMessage));
  }

  sendUnsubscription(ticker) {
    const unsubscribeMessage = {
      action: 'unsubscribe',
      params: {
        symbols: ticker
      }
    };
    this.ws.send(JSON.stringify(unsubscribeMessage));
  }

  notifySubscribers(data) {
    const ticker = data.symbol;
    if (this.subscribers.has(ticker)) {
      this.subscribers.get(ticker).forEach(callback => callback(data));
    }
  }

  async addTickerToDatabase(userId, ticker) {
    try {
      const [tickerRecord, created] = await Ticker.findOrCreate({
        where: { userId, symbol: ticker },
        defaults: { userId, symbol: ticker }
      });

      if (created) {
        console.log(`Ticker ${ticker} added to database for user ${userId}`);
      } else {
        console.log(`Ticker ${ticker} already exists for user ${userId}`);
      }

      return tickerRecord;
    } catch (error) {
      console.error('Error adding ticker to database:', error);
      throw error;
    }
  }

  async removeTickerFromDatabase(userId, ticker) {
    try {
      const deletedCount = await Ticker.destroy({
        where: { userId, symbol: ticker }
      });

      if (deletedCount > 0) {
        console.log(`Ticker ${ticker} removed from database for user ${userId}`);
      } else {
        console.log(`Ticker ${ticker} not found in database for user ${userId}`);
      }

      return deletedCount;
    } catch (error) {
      console.error('Error removing ticker from database:', error);
      throw error;
    }
  }

  async getUserTickersFromDatabase(userId) {
    try {
      const tickers = await Ticker.findAll({
        where: { userId },
        attributes: ['symbol'],
      });
      return tickers.map(ticker => ticker.symbol);
    } catch (error) {
      console.error('Error fetching user tickers from database:', error);
      throw error;
    }
  }

}

module.exports = new MarketDataService();