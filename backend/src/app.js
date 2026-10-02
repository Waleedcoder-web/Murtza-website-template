const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Route Handlers
const productsRoute = require('./routes/products');
const categoriesRoute = require('./routes/categories');
const uploadRoute = require('./routes/upload');
const offersRoute = require('./routes/offers');
const ordersRoute = require('./routes/orders');
const artworkRoute = require('./routes/artwork');
const contactRoute = require('./routes/contact');
const statsRoute = require('./routes/stats');

const app = express();

// Middlewares
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// REST API Endpoints
app.use('/api/products', productsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/offers', offersRoute);
app.use('/api/featured-products', productsRoute);
app.use('/api/apparel-products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/artwork', artworkRoute);
app.use('/api/contact', contactRoute);
app.use('/api/stats', statsRoute);

// Static Shared Assets Serving
app.use('/css', express.static(path.join(__dirname, '../../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../../frontend/js')));
app.use('/assets', express.static(path.join(__dirname, '../../frontend/assets')));

// Admin Portal Route (/admin)
app.use('/admin', express.static(path.join(__dirname, '../../frontend/admin')));

// User Storefront Subpath Route (/user)
app.use('/user', express.static(path.join(__dirname, '../../frontend/user')));

// User Storefront Root Route (/)
app.use('/', express.static(path.join(__dirname, '../../frontend/user')));

module.exports = app;
