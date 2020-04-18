import UserMutation from 'resolvers/UserMutation';
import QuizMutation from 'resolvers/QuizMutation';
import QuestionMutation from 'resolvers/QuestionMutation';
import Query from 'resolvers/Query';

export default {
  Query,
  Mutation: { ...UserMutation, ...QuizMutation, ...QuestionMutation },
};
