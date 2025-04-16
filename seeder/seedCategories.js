const mongoose = require('mongoose');
const { Category } = require('../models/category');

mongoose.connect('mongodb://localhost:27017/yourdbname');

async function seedCategories() {
  await Category.deleteMany();
  const categories = [
    { name: 'Fiction' },
    { name: 'Non-fiction' },
    { name: 'Science' },
    { name: 'Technology' },
    { name: 'Romance' },
    { name: 'Mystery' },
    { name: 'Biography' },
    { name: 'History' },
    { name: 'Business' },
    { name: 'Self-Help' },
    { name: 'Poetry' },
    { name: 'Art' },
    { name: 'Travel' },
    { name: 'Cooking' },
    { name: 'Children' },
    { name: 'Comics' },
    { name: 'Religion' },
    { name: 'Philosophy' },
    { name: 'Psychology' },
    { name: 'Sports' },
    { name: 'Music' },
    { name: 'Health' },
    { name: 'Education' },
    { name: 'Reference' }
  ];

  await Category.insertMany(categories);
  console.log('✅ Categories seeded');
  mongoose.disconnect();
}

seedCategories();
