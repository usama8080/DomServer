"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dragoncount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dragoncount.belongsTo(models.User);
      Dragoncount.belongsTo(models.Dragons);
    }
  }
  Dragoncount.init(
    {
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Dragoncount",
    }
  );
  return Dragoncount;
};
