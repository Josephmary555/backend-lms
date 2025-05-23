const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action:    { type: String, required: true },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  detail:    { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
