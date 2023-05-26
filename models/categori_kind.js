'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categori_kind extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  categori_kind.init({
    nama: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'categori_kind',
  });
  return categori_kind;
};