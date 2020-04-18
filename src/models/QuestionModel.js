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
});

export default mongoose.model('Question', QuestionModel);
