'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product.init({
    nama: DataTypes.STRING,
    descripsi: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    kategori_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product',
    freezeTableName: true
  });
  return product;
};