"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Achievements extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Achievements.hasMany(models.UnlockedAcheievements);
    }
  }
  Achievements.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      xp: DataTypes.INTEGER,
      aura: DataTypes.INTEGER,
      amount: DataTypes.STRING,
      typeOfAchievements: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Achievements",
    }
  );
  return Achievements;
};
