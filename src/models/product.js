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
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
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
