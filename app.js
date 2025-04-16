const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
require('dotenv').config();

const SECRET = process.env.SECRET;
mongoose.connect(process.env.MONGO_URI);
const PORT = process.env.PORT || 3001;

const logger = require('./middleware/logger');
app.use(logger);


mongoose.connect('mongodb://localhost:3001/libraryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/logs', require('./routes/logs'));

app.listen(3000, () => console.log('Server running on port 3001'));


mongoose.connect('mongodb://localhost:3001/myapp', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
