const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    shopifyAccessToken: {
      type: DataTypes.STRING,
    },
    shopifyShopName: {
      type: DataTypes.STRING,
    },
  });

  User.associate = models => {
    User.hasMany(models.Product, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async login => {
    const found = await User.findOne({
      where: { email: login },
    });

    return found;
  };

  return User;
};

export default user;
