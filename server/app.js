require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middleware/authMiddleware'); // Auth middleware

// Imported Middleware
app.use(cors());
app.use(express.json());

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
  });


// Routing
app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => {
  res.send('This is going to be a market app');
});

// Example of a protected route (requires valid JWT)
app.get('/api/users', authenticateToken, (req, res) => {    
    res.json({ message: 'protected user route!', user: req.user });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
