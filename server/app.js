const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('./models/Book');
require('./models/User');

// routes
const books = require('./routes/api/books');
const users = require('./routes/api/users');

const app = express();

// Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

// use Routes
app.use('/api/books', books);
app.use('/api/users', users);

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
