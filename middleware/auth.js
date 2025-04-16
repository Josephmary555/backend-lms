const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

const SECRET = 'your-secret-key'; // should be in .env
// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '24h' });
};

// Middleware to verify token
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'Invalid user' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check for admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};

module.exports = { authenticate, isAdmin };
