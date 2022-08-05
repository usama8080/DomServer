"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.PlayerStat);
      User.hasMany(models.KilledBy);
      User.hasMany(models.Killed);
      User.hasMany(models.UnlockedAcheievements);
      User.hasMany(models.SkillUsed);
      User.hasMany(models.Dragoncount);
      User.hasMany(models.BattleStats);
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      walletaddress: DataTypes.STRING,
      verificationToken: DataTypes.STRING,
      accessToken: DataTypes.STRING,
      resetToken: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
      emailVerified: DataTypes.BOOLEAN,
      profileImg: DataTypes.STRING,
      verifyEmailForgetPassword: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
