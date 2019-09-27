import bcrypt from 'bcrypt';

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
        notEmpty: {
          args: true,
          msg: `Email can't be empty.`,
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Password can't be empty.`,
        },
        len: [7, 42],
      },
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

  User.findByEmail = async login => {
    const found = await User.findOne({
      where: { email: login },
    });

    return found;
  };

  User.beforeCreate(async self => {
    // eslint-disable-next-line no-param-reassign
    self.password = await self.generatePasswordHash();
  });

  User.prototype.generatePasswordHash = async function generatePasswordHash() {
    const saltRounds = 10;
    return bcrypt.hash(this.password, saltRounds);
  };

  User.prototype.validatePassword = async function validatePassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};

export default user;
