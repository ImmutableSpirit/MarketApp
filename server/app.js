require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const marketDataService = require('./services/marketDataService');
const marketDataRoutes = require('./routes/marketDataRoutes');
const sequelize = require('./config/database'); 
const User = require('./models/user'); 
const authenticateToken = require('./middleware/authMiddleware'); // Auth middleware
const http = require('http');
const socketIo = require('socket.io');
const WebSocket = require('ws');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Imported Middleware
app.use(cors({
  origin: 'http://localhost:5173', // or whatever port your frontend is running on
  methods: ['GET', 'POST']
}));
app.use(express.json());
app.use(morgan('combined'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
  });

// Routing
app.use('/api/auth', authRoutes); 
app.use('/api/market-data', marketDataRoutes);

app.get('/', (req, res) => {
  res.send('This is a market app');
});

// Initialize Socket.IO
const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
app.io = io;

// Connect WebSocket
marketDataService.connect(process.env.TWELVEDATA_API_KEY);
console.log('API KEY FOR MARKET DATA:', process.env.TWELVEDATA_API_KEY);

// Socket.IO connection handling
/* io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle subscription requests
  socket.on('subscribe', async (ticker) => {
    console.log(`Subscribing to ticker: ${ticker}`);
    // Add ticker to subscribers list
    marketDataService.subscribeTicker(ticker);

    // Fetch initial price and emit to client
    try {
      const data = await twelvedata.quotes.price(ticker);
      console.log('Subscribed:', data);
      socket.emit(`tickerUpdate:${ticker}`, data);
    } catch (error) {
      console.error('Error fetching ticker price:', error);
    }
  });

  // Handle unsubscription requests
  socket.on('unsubscribe', (ticker) => {
    console.log(`Unsubscribing from ticker: ${ticker}`);
    // Remove ticker from subscribers list
    marketDataService.unsubscribeTicker(ticker);
    console.log('Unsubscribed:', ticker);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
}); */

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  //connectToTwelveData();
});




const connectToTwelveData = () => {
  console.log("Connecting to TwelveData...");
  // Create a WebSocket connection to TwelveData API
  const ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${process.env.TWELVEDATA_API_KEY}`);

  ws.on('open', () => {
    console.log('Connected to TwelveData WebSocket API');
    // Subscribe to stock symbols
    const subscribeMsg = {
      action: 'subscribe',
      params: {
        symbols: 'EUR/USD'
      }
    };
    
    ws.send(JSON.stringify(subscribeMsg));
  });

  ws.on('message', (data) => {
    try {
      const jsonData = JSON.parse(data);
      // Emit the price to all connected Socket.io clients
      io.emit('Price', jsonData.price);
      console.log(`Price: $${jsonData.price}`);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });

  ws.on('error', (error) => {
    console.error('TwelveData WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('Disconnected from TwelveData WebSocket API');
  });
  console.log('TwelveData connections configured.');
}