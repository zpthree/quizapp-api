const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiry: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  quizzes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
});

module.exports = mongoose.model('User', UserSchema);
