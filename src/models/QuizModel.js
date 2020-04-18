import mongoose from 'mongoose';

const QuizModel = new mongoose.Schema({
  title: {
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
});

export default mongoose.model('Quiz', QuizModel);
