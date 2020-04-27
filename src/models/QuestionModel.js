import mongoose from 'mongoose';

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
    required: true,
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

export default mongoose.model('Question', QuestionModel);
