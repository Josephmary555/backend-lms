const express = require('express');
const router = express.Router();
const { Reservation, Book } = require('../models/reservation');
const { sendReservationEmail } = require('../utils/mailer');

router.post('/', async (req, res) => {
  const { user, book, fromDate, toDate } = req.body;
  const reservation = new Reservation({ user, book, fromDate, toDate });
  await reservation.save();

  const reservedBook = await Book.findByIdAndUpdate(book, {available: false},{ new: true} );
  const userData = await User.findById(user);

  sendReservationEmail(userData.email, reservedBook.title);

  res.json({ message: 'Book reserved & email sent', reservation });
});

router.put('/:id/return', async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status: 'returned' }, { new: true });
  await Book.findByIdAndUpdate(reservation.book, { available: true });
  res.json({ message: 'Book returned', reservation });
});

module.exports = router;
// This code defines a set of routes for managing book reservations in a library system.