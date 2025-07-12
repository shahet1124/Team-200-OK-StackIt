const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS middleware - allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/questions', require('./routes/questions'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'StackIt API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`StackIt API running on port ${PORT}`)); 