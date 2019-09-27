export default {
  Query: {
    users: async (parents, args, { models }) => models.User.findAll(),
    user: async (parent, { id }, { models }) => models.User.findByPk(id),
    me: async (parent, args, { models, me }) => {
      if (!me) return null;

      return models.User.findByPk(me.id);
    },
  },
  User: {
    products: async (user, args, { models }) =>
      models.Product.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
