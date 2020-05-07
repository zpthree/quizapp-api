const mongoose = require('mongoose');

const QuizModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  featuredImage: {
    type: String,
  },
  questionCount: {
    type: Number,
  },
  attempts: {
    type: Number,
  },
  tags: [{ type: String }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
});

module.exports = mongoose.model('Quiz', QuizModel);
