const express = require('express');
const router = express.Router();
const { Book } = require('../models/books');

// Add book (admin only)
router.post("/upload", async (req, res) => {
  try {
    const { title, author, description, isbn, category, publishedYear, coverImage } = req.body;

    const newBook = new Book({
      title,
      author,
      description,
      isbn,
      category,
      publishedYear,
      coverImage,
      uploadDate,
      available,
      copies,
    });

    await newBook.save();
    res.status(201).json({ message: "Book uploaded successfully", book: newBook });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload book" });
  }
});
// Get all books (admin only)
router.get('/', async (req, res) => {
  const books = await Book.find().populate('category');
  res.json(books);
});

router.post('/', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json({ message: 'Book added', book });
});

router.put('/:id', async (req, res) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

module.exports = router;
// This code defines a set of routes for managing books in a library system.
