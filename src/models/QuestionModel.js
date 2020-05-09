const mongoose = require('mongoose');

const QuestionModel = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      answer: {
        type: String,
        required: true,
      },
      correct: {
        type: Boolean,
        required: true,
      },
    },
  ],
  answerCount: {
    type: Number,
  },
  featuredImage: {
    type: String,
  },
  explanation: {
    type: String,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
});

module.exports = mongoose.model('Question', QuestionModel);
