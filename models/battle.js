"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Battle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Battle.hasMany(models.BattleStats);
      Battle.belongsTo(models.Territories);
      Battle.hasMany(models.UnlockedAcheievements);
    }
  }
  Battle.init(
    {
      type: DataTypes.STRING,
      duration: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Battle",
    }
  );
  return Battle;
};
