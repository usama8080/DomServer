"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dragons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dragons.hasOne(models.Dragoncount);
    }
  }
  Dragons.init(
    {
      dragonid: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      ankle: DataTypes.STRING,
      dragon: DataTypes.STRING,
      bracelet: DataTypes.STRING,
      eyes: DataTypes.STRING,
      head: DataTypes.STRING,
      horns: DataTypes.STRING,
      necklace: DataTypes.STRING,
      shoulder: DataTypes.STRING,
      tail: DataTypes.STRING,
      tailends: DataTypes.STRING,
      teeth: DataTypes.STRING,
      wings: DataTypes.STRING,
      background: DataTypes.STRING,
      class: DataTypes.STRING,
      category: DataTypes.STRING,
      ankleDmg: DataTypes.INTEGER,
      hp: DataTypes.INTEGER,
      braceletDmg: DataTypes.INTEGER,
      eyeDmg: DataTypes.INTEGER,
      tailDmg: DataTypes.INTEGER,
      headDmg: DataTypes.INTEGER,
      hornsDmg: DataTypes.INTEGER,
      necklaceDmg: DataTypes.INTEGER,
      shoulderDmg: DataTypes.INTEGER,
      tailDmg: DataTypes.INTEGER,
      tailendsDef: DataTypes.INTEGER,
      teethDmg: DataTypes.INTEGER,
      wingsDef: DataTypes.INTEGER,
      specialAttack: DataTypes.STRING,
      damage: DataTypes.INTEGER,
      defence: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Dragons",
    }
  );
  return Dragons;
};
