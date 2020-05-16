const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
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
  themeColor: String,
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
