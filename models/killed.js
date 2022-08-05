'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Killed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Killed.belongsTo(models.User)
    }
  };
  Killed.init({
    count: DataTypes.INTEGER,
    killedid:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Killed',
  });
  return Killed;
};