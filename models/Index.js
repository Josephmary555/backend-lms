const User = require('./User');
const Book = require('./Book');
const Reservation = require('./Reservation/Reservation');
const Category = require('./Category/Category');
const Token = require('./Token/Token');
const Admin = require('./Admin');
const Log = require('./Log');

module.exports = {
  User,
  Book,
  Reservation,
  Category,
  Token,
  Admin,
  Log
};
// This module imports all the models and exports them as an object.