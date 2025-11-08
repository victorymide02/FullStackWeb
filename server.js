const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initDB } = require('./app/models/database');

// Initialise app FIRST
const app = express();

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialise database
initDB();

// Import routes
const userRoutes = require('./app/routes/userRoutes');
const auctionRoutes = require('./app/routes/auctionsRoutes');

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/auctions', auctionRoutes);

// Root endpoint (optional)
app.get('/', (req, res) => {
    res.json({ status: 'Alive' });
});

// 404 fallback
app.use((req, res) => {
    res.sendStatus(404);
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const HTTP_PORT = 3333;
app.listen(HTTP_PORT, () => {
    console.log('✅ Server running on port: ' + HTTP_PORT);
});
