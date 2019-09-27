const product = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    shopifyId: DataTypes.BIGINT,
    type: DataTypes.STRING,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    vendor: DataTypes.STRING,
  });

  Product.associate(models => {
    Product.belongsTo(models.User);
  });

  return Product;
};

export default product;
