const mongoose = require('mongoose');
require('./Book');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

module.exports = User = mongoose.model('User', UserSchema);
