const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v - password')
        return userData;
      }
      throw new AuthenticationError('Not Currently Logged In! Try Again');
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const newBook = await User.findByIdAndUpdate(context.user._id, { $push: { book: bookData } });
        return newBook;
      }
      throw new AuthenticationError('Not logged in');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const newBook = await User.findOneAndDelete(context.user._id, { $pull: { book: bookId } });
        return newBook;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Incorrect credentials');
    }
    const correctPw = await user.isCorrectPassword(password);
    if (!correctPw) {
      throw new AuthenticationError('Incorrect credentials');
    }
    const token = signToken(user);
    return { token, user };
  }
};

module.exports = resolvers;