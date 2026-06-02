require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('node:dns').setServers(['1.1.1.1', '8.8.8.8'])

const productRoutes = require('./routes/productRoutes');
const reasonToCallRoutes = require('./routes/reasonToCallRoutes');
const returnOrderTypeRoutes = require('./routes/returnOrderTypeRoutes');
const courierRoutes = require('./routes/courierRoutes');
const returnOrderRoutes = require('./routes/returnOrderRoutes');

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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Wrixty Backend API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
