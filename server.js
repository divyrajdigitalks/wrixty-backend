require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('node:dns').setServers(['1.1.1.1', '8.8.8.8'])
const mongoose = require('mongoose');

// Global plugin to handle MongoDB Duplicate Key Errors
mongoose.plugin((schema) => {
  const handleDuplicateKey = function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const formatField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const value = error.keyValue[field];
      next(new Error(`${formatField} '${value}' already exists.`));
    } else {
      next(error);
    }
  };

  schema.post('save', handleDuplicateKey);
  schema.post('update', handleDuplicateKey);
  schema.post('updateOne', handleDuplicateKey);
  schema.post('updateMany', handleDuplicateKey);
  schema.post('findOneAndUpdate', handleDuplicateKey);
  schema.post('insertMany', handleDuplicateKey);
});

const productRoutes = require('./routes/productRoutes');
const reasonToCallRoutes = require('./routes/reasonToCallRoutes');
const returnOrderTypeRoutes = require('./routes/returnOrderTypeRoutes');
const courierRoutes = require('./routes/courierRoutes');
const returnOrderRoutes = require('./routes/returnOrderRoutes');
const settingRoutes = require('./routes/settingRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api', require('./routes'));
app.use('/api/products', productRoutes);
app.use('/api/reason-to-calls', reasonToCallRoutes);
app.use('/api/return-order-types', returnOrderTypeRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/return-orders', returnOrderRoutes);
app.use('/api/settings', settingRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Wrixty Backend API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
