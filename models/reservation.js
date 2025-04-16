const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book:      { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  fromDate:  { type: Date, required: true },
  toDate:    { type: Date, required: true },
  status:    { type: String, enum: ['pending', 'approved', 'returned'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
