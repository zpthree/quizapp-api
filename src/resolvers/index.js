const UserMutation = require('./UserMutation');
const QuizMutation = require('./QuizMutation');
const QuestionMutation = require('./QuestionMutation');
const Query = require('./Query');

module.exports = {
  Query,
  Mutation: { ...UserMutation, ...QuizMutation, ...QuestionMutation },
};
