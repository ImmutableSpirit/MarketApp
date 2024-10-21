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

let connections = 0;

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

io.on('connection', (socket) => {
  connections++;
  console.log('MarketApp client connected to server');
  console.log(`Current connections: ${connections}`);
  console.log(`Number of connected clients: ${io.engine.clientsCount}`);

  // Handle disconnection for this socket
  socket.on('disconnect', () => {
    connections--;
    console.log('User disconnected');
    console.log(`Current connections: ${connections}`);
    console.log(`Number of connected clients: ${io.engine.clientsCount}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  //connectToTwelveData();
});
