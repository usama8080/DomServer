"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Skills", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dragonClass: {
        type: Sequelize.STRING,
      },
      skillName: {
        type: Sequelize.STRING,
      },
      skillType: {
        type: Sequelize.STRING,
      },
      basicDamage: {
        type: Sequelize.INTEGER,
      },
      basicDefense: {
        type: Sequelize.INTEGER,
      },
      specialDamage: {
        type: Sequelize.INTEGER,
      },
      specialConditions: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      criticalProbability: {
        type: Sequelize.INTEGER,
      },
      criticalDamage: {
        type: Sequelize.FLOAT,
      },
      criticalDefense: {
        type: Sequelize.FLOAT,
      },
      ManaConsumed: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Skills");
  },
};
