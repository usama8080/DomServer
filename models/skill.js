"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Skill.hasMany(models.SkillUsed, { foreignKey: "skillId" });
    }
  }
  Skill.init(
    {
      dragonClass: DataTypes.STRING,
      skillName: DataTypes.STRING,
      skillType: DataTypes.STRING,
      basicDamage: DataTypes.INTEGER,
      basicDefense: DataTypes.INTEGER,
      specialDamage: DataTypes.INTEGER,
      specialConditions: DataTypes.STRING,
      description: DataTypes.STRING,
      criticalProbability: DataTypes.INTEGER,
      criticalDamage: DataTypes.FLOAT,
      criticalDefense: DataTypes.FLOAT,
      ManaConsumed: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Skill",
    }
  );
  return Skill;
};
