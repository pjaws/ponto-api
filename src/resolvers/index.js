import uuidv4 from 'uuid/v4';

const resolvers = {
  Query: {
    users: (parents, args, { models }) => Object.values(models.users),
    user: (parent, { id }, { models }) => models.users[id],
    me: (parent, args, { me }) => me,
    products: (parents, args, { models }) => Object.values(models.products),
    product: (parent, { id }, { models }) => models.products[id],
  },

  Mutation: {
    createProduct: (parent, { title }, { me, models }) => {
      const id = uuidv4();
      const product = {
        id,
        title,
        userId: me.id,
      };

      // eslint-disable-next-line no-param-reassign
      models.products[id] = product;
      models.users[me.id].productIds.push(id);

      return product;
    },
    deleteProduct: (parent, { id }, { models }) => {
      const { [id]: product, ...rest } = models.products;

      if (!product) return false;

      // eslint-disable-next-line no-param-reassign
      models.products = rest;

      return true;
    },
  },

  User: {
    products: (user, args, { models }) =>
      Object.values(models.products).filter(p => p.userId === user.id),
  },
  Product: {
    user: (product, args, { models }) => models.users[product.userId],
  },
};

export default resolvers;
