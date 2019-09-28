import Sequelize from 'sequelize';

// eslint-disable-next-line import/prefer-default-export
export const batchUsers = async (keys, models) => {
  const users = await models.User.findAll({
    where: {
      id: {
        [Sequelize.Op.in]: keys,
      },
    },
  });
  return keys.map(key => users.find(user => user.id === key));
};
