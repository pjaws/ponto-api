export default {
  Query: {
    users: (parents, args, { models }) => Object.values(models.users),
    user: (parent, { id }, { models }) => models.users[id],
    me: (parent, args, { me }) => me,
  },
  User: {
    products: (user, args, { models }) =>
      Object.values(models.products).filter(p => p.userId === user.id),
  },
};
