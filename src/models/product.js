const product = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Title can't be empty.`,
        },
      },
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `SKU can't be empty.`,
        },
      },
    },
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(2),
    shopifyId: DataTypes.BIGINT,
    type: DataTypes.STRING,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    vendor: DataTypes.STRING,
  });

  Product.associate = models => {
    Product.belongsTo(models.User);
  };

  return Product;
};

export default product;
