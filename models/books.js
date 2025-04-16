const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  author:     { type: String, required: true },
  description:{ type: String, required: true },
  isbn:       { type: String, unique: true },
  category:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  publishedYear: { type: Number },
  coverImage: { type: String },
  uploadDate: { type: Date, default: Date.now },
  available:  { type: Boolean, default: true },
  copies:     { type: Number, default: 1 }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = mongoose.model('Book', bookSchema);
