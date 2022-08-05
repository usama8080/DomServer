"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlayerStat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlayerStat.belongsTo(models.User);

      //PlayerStat.hasMany(models.Dragon)
    }
  }
  PlayerStat.init(
    {
      xp: DataTypes.INTEGER,
      level: DataTypes.INTEGER,
      grade: DataTypes.STRING,
      aura: DataTypes.INTEGER,
      wins: DataTypes.INTEGER,
      loses: DataTypes.INTEGER,
      winStreak: DataTypes.INTEGER,
      played: DataTypes.INTEGER,
      hoursPlayed: DataTypes.STRING,
      dodge: DataTypes.INTEGER,
      steal: DataTypes.INTEGER,
      frozen: DataTypes.INTEGER,
      killCount: DataTypes.INTEGER,
      dailyStreak: DataTypes.INTEGER,
      matchesWonWithAll3Dragon: DataTypes.INTEGER,
      lossStreak: DataTypes.INTEGER,
      criticalKills: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PlayerStat",
    }
  );
  return PlayerStat;
};
