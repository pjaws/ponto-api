export default {
  Query: {
    products: async (parents, args, { models, me }) =>
      models.Product.findAll({
        where: {
          userId: me.id,
        },
      }),
    product: async (parent, { id }, { models }) => models.Product.findByPk(id),
  },
  Mutation: {
    createProduct: async (parent, product, { me, models }) =>
      models.Product.create({
        ...product,
        userId: me.id,
      }),
    deleteProduct: async (parent, { id }, { models }) =>
      models.Product.destroy({ where: { id } }),
  },
  Product: {
    user: async (product, args, { models }) =>
      models.User.findByPk(product.userId),
  },
};
