"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("BattleStats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      winlose: {
        type: Sequelize.BOOLEAN,
      },
      normalAttacks: {
        type: Sequelize.INTEGER,
      },
      specialAttacks: {
        type: Sequelize.INTEGER,
      },
      criticalAttacks: {
        type: Sequelize.INTEGER,
      },
      dragon1: {
        type: Sequelize.INTEGER,
      },
      dragon2: {
        type: Sequelize.INTEGER,
      },
      dragon3: {
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
    await queryInterface.dropTable("BattleStats");
  },
};
