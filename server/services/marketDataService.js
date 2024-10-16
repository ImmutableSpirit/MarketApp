const WebSocket = require('ws');

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
      console.log("TwelveData reponse: ==============================")
      console.log(parsedData);
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
}

module.exports = new MarketDataService();