const express = require('express');
const router = express.Router();
const { Admin } = require('../models/Admin');

// You could create new admin accounts here or protect this route
router.post('/create', async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Admin already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, email, password: hashed });
  await admin.save();

  res.json({ message: 'Admin created' });
});

module.exports = router;
