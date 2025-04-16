const express = require('express');
const router = express.Router();
const { Log } = require('../models/logs');

router.get('/', async (req, res) => {
  const logs = await Log.find().populate('user');
  res.json(logs);
});

router.post('/', async (req, res) => {
  const log = new Log(req.body);
  await log.save();
  res.json({ message: 'Log created', log });
});

module.exports = router;
// This code defines a set of routes for managing logs in a library system.