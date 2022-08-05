'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KilledBy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      KilledBy.belongsTo(models.User)
      
      
    }
  };
  KilledBy.init({
    count: DataTypes.INTEGER,
    killedbyid: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'KilledBy',
  });
  return KilledBy;
};