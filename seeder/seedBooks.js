const mongoose = require('mongoose');
const { Book, Category } = require('../models/books');

mongoose.connect('mongodb://localhost:27017/yourdbname');


async function seedBooks() {
  await Book.deleteMany();
  const categories = await Category.find();

  const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: categories[0]._id, available: true },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', category: categories[2]._id, available: true },
    { title: 'Clean Code', author: 'Robert C. Martin', category: categories[3]._id, available: true },
  ];

  await Book.insertMany(books);
  console.log('✅ Books seeded');
  mongoose.disconnect();
}

seedBooks();
// This script connects to the MongoDB database, deletes any existing books, and seeds the database with new book data.