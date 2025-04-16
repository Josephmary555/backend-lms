const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');

router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

router.post('/', async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.json({ message: 'Category added', category });
});

module.exports = router;
// This code defines a set of routes for managing categories in a library system.