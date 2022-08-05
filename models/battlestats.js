"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BattleStats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //BattleStats.hasMany(models.UnlockedAcheievements);
      BattleStats.belongsTo(models.User);
      BattleStats.belongsTo(models.Battle);
    }
  }
  BattleStats.init(
    {
      winlose: DataTypes.BOOLEAN,
      normalAttacks: DataTypes.INTEGER,
      specialAttacks: DataTypes.INTEGER,
      criticalAttacks: DataTypes.INTEGER,
      dragon1: DataTypes.INTEGER,
      dragon2: DataTypes.INTEGER,
      dragon3: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BattleStats",
    }
  );
  return BattleStats;
};
