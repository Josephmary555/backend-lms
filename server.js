// 1. Load Core Modules & Third-party Packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// 2. Load Custom Modules

const config = require('./config.js');
const booksRoute = require('./routes/booksroute.js');
// const usersRoute = require('./routes/usersroute.js'); // Uncomment if needed


// 3. Load Environment Variables

dotenv.config(); // Loads variables from .env into process.env


// 4. Initialize Express App

const app = express();


// 5. Global Middleware Setup

app.use(cors());                         // Enables CORS
app.use(express.json());                // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(bodyParser.json());             // Redundant but included for legacy support
app.use(morgan('dev'));                 // Logs incoming requests to console
app.use(express.static('public'));      // Serves static files from 'public' folder

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running!' });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is healthy!' });
});
app.get('/api/exit', (req, res) => {
  res.json({ message: 'Server is shutting down...' });
  process.exit(0); // Gracefully shut down the server
});
// 6. MongoDB Connection

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// 7. Mongoose User Schema & Model

const usersSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});

const User = mongoose.model('User', usersSchema);


// 8. Custom Middleware

function requestLogger(req, res, next) {
  console.log(`📥 [${req.method}] ${req.url}`);
  next();
}
app.use(requestLogger);


// 9. File-based User Data Helpers (Temporary - migrate to DB later)

const USERS_FILE = './data/users.json';

const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};


// 10. Authentication Routes (File-based logic)


// Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  let users = getUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists!' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ name, email, password: hashedPassword });
  saveUsers(users);

  res.json({ message: 'Registration successful!' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (user && bcrypt.compareSync(password, user.password)) {
    return res.json({ message: 'Login successful!', user: { name: user.name, email: user.email } });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Update Profile
app.post('/update-profile', async (req, res) => {
  const { email, newName, newEmail } = req.body;
  let users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found!' });
  }

  users[userIndex].name = newName || users[userIndex].name;
  users[userIndex].email = newEmail || users[userIndex].email;
  saveUsers(users);

  res.json({ message: 'Profile updated successfully!', user: users[userIndex] });
});

// Forgot Password
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
  saveUsers(users);

  console.log(`🔐 Password reset token for ${email}: ${resetToken}`);
  res.json({ message: 'Password reset link sent to your email!' });
});

// Reset Password
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  let users = getUsers();
  const user = users.find(u => u.resetToken === token && u.resetTokenExpiration > Date.now());

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token!' });
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  saveUsers(users);

  res.json({ message: 'Password has been reset successfully!' });
});


// 11. App Routes


// Book Routes (via Router)
app.use("/api/books", booksRoute);

// User Routes (Uncomment if route module exists)
// app.use('/api/users', usersRoute);

// Exit Endpoint (Dev/Testing Only)
app.post('/exit', (req, res) => {
  res.json({ message: 'Server is shutting down...' });
  process.exit();
});


// 12. Start Express Server

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
