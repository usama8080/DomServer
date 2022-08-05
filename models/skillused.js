'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SkillUsed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SkillUsed.belongsTo(models.User);
      SkillUsed.belongsTo(models.Skill, {foreignKey: 'skillId'})
      
    }
  };
  SkillUsed.init({
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SkillUsed',
  });
  return SkillUsed;
};