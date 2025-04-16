// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

// PUT /api/users/:id/promote
router.put('/:id/promote', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can promote users' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User promoted to admin', user });
  } catch (err) {
    res.status(500).json({ message: 'Error promoting user' });
  }
});


// GET /api/users
router.get('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can view users' });
  }

  const users = await User.find({}, '-password'); // exclude passwords
  res.json(users);
});


module.exports = router;
