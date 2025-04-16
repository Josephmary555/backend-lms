const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');
const { authenticate, authorize } = require('../middleware/auth');

const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/admin-only-data', authenticate, isAdmin, (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});
// This route is protected and only accessible to admins
const SECRET = 'your-secret-key'; // use env var in production

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();

    res.json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
