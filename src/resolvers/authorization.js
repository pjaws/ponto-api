import { ForbiddenError } from 'apollo-server-express';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (_, __, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated.');

export const isAdmin = combineResolvers(
  isAuthenticated,
  (_, __, { me: { role } }) =>
    role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.')
);

export const isProductOwner = async (_, { id }, { models, me }) => {
  const product = await models.Product.findByPk(id, { raw: true });

  if (product.userId !== me.id)
    throw new ForbiddenError('Not authenticated as owner.');

  return skip;
};
