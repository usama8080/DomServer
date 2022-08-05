"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PlayerStat", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      xp: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      level: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      grade: {
        type: Sequelize.STRING,
        default: "zero",
      },
      aura: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      wins: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      winStreak: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      loses: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      played: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      hoursPlayed: {
        type: Sequelize.STRING,
        default: 0,
      },
      dodge: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      steal: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      frozen: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      killCount: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      dailyStreak: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      matchesWonWithAll3Dragon: {
        type: Sequelize.INTEGER,
        default: 0,
      },

      lossStreak: {
        type: Sequelize.INTEGER,
      },
      criticalKills: {
        type: Sequelize.INTEGER,
        default: 0,
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
    await queryInterface.dropTable("PlayerStat");
  },
};
